const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = 'MukandoManagerKey';

//Create user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required'})
    };

    try {
        const existing = await User.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({error: 'Username is already taken'})
        };

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashed });
        res.status(201).json({message: 'Successfully created account'})
    } catch (err) {
        res.json({error: err.message})
    }
});

//Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required'})
    };

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Wrong username or password'});
        };

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Wrong username or password'});
        };

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '60d'});
        return res.json({ message: 'Login Successful', token })
    } catch (err) {
        return res.status(500).json({ error: err.mesage })
    }
});

module.exports = router