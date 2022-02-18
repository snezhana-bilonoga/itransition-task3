const { Router } = require('express');
const config = require('config');
const User = require('./models/User');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong, try again' });
    }
});

router.post('/block/:id', auth, async (req, res) => {
    try {
        const users = await User.findOneAndUpdate(
            { _id: req.params.id },
            { isBlocked: true },
            { useFindAndModify: false }
        );
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong, try again' });
    }
});

router.post('/unblock/:id', auth, async (req, res) => {
    try {
        const users = await User.findOneAndUpdate(
            { _id: req.params.id },
            { isBlocked: false },
            { useFindAndModify: false }
        );
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong, try again' });
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const users = await User.findOneAndDelete(
            { _id: req.params.id },
            { useFindAndModify: false }
        );
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: 'Something wrong, try again' });
    }
});

module.exports = router;
