const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('./models/User');
const router = Router();

router.post(
    '/register',
    [
        check('email', 'Not correct email').isEmail(),
        check('password', 'Minimum password length 1 symbol').isLength({
            min: 1,
        }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Not correct registration data',
                });
            }

            const { userName, email, password } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return res
                    .status(400)
                    .json({ message: 'Such user already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                userName,
                email,
                password: hashedPassword,
            });

            await user.save();
            res.status(201).json({ message: 'User is created' });
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    }
);
module.exports = router;
