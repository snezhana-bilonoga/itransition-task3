const { Router } = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('./models/User');
const router = Router();

router.post(
    '/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Not correct login data',
                });
            }
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'User is not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: 'Not correct password, try again' });
            }

            if (user.isBlocked) {
                return res.status(400).json({ message: 'User is blocked ' });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            user.dateLastLogin = new Date();
            await user.save();

            res.json({ token, userId: user.id });
        } catch (e) {
            res.status(500).json({ message: 'Something wrong, try again' });
        }
    }
);

module.exports = router;
