const { Op } = require('sequelize');
const express = require('express');
const { Member, Club } = require('../models/Relationships');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
    try {
        const clubs = await Club.findAll({
            where: {
                [Op.or]: [
                    { userId: req.user.id },
                    { '$members.userId$': req.user.id }
                ]
            },
            include: [
                {
                    model: Member,
                    as: "members",
                    required: false
                }
            ]
        });
        res.json(clubs)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
});

router.post('/', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' })
    }

    try {
        const club = await Club.create({
            userId: req.user.id,
            title
        });
        res.status(201).json({ message: 'Club created successfully'})
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
});

router.patch('/:id', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' })
    }

    try {
        const club = await Club.findByPk(req.params.id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' })
        };

        club.title = title;
        await club.save();
        res.status(200).json({ message: 'Club renamed successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
});

router.delete('/:id', async (req, res) => {
    const club = await Club.findByPk(req.params.id);
    if (!club) {
        return res.status(404).json({ message: 'Club not found' })
    };

    try {
        const members = await Member.findAll({
            where: {
                clubId: req.params.id
            }
        });
        if (members) {
            for (const member of members) {
                await member.destroy()
            }
        };

        await club.destroy();
        res.status(204).json({ message: 'Club deleted successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
})

module.exports = router