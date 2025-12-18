const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize')

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

//Register user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    };

    try {
        const existing = await User.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: 'Username is already taken' })
        };

        const hashed = await bcrypt.hash(password, process.env.BCRYPT_SALT);
        const user = await User.create({ username, email, password: hashed });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1d' });
        res.status(201).json({ message: 'Successfully created account', token })
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
});

//Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    };

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email: username }
                ]
            }
        });
        if (!user) {
            return res.status(400).json({ error: 'Wrong username or password' });
        };

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Wrong username or password' });
        };

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ message: 'Login Successful', token })
    } catch (err) {
        res.status(500).json({ error: err.mesage })
    }
});

module.exports = router