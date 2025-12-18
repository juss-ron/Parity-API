const { Op } = require('sequelize');
const express = require('express');
const { Member, Club } = require('../models/Relationships');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.use(auth);

// Get all clubs
router.get('/', async (req, res) => {
    try {
        const memberships = await Member.findAll({
            where: { userId: req.user.id },
            attributes: ['clubId']
        });

        const clubIds = memberships.map(m => m.clubId)

        const clubs = await Club.findAll({
            where: {
                [Op.or]: [
                    { userId: req.user.id },
                    { id: clubIds }
                ]
            },
            include: [
                {
                    model: Member,
                    as: 'members',
                    required: false
                }
            ]
        });

        const enriched = clubs.map(club => {
            const members = club.members || [];
            const totalInvestment = members.reduce((sum, m) => sum + m.investment, 0);
            const totalInterest = members.reduce((sum, m) => sum + m.interestAcrued, 0);
            const owed = members.reduce((sum, m) => sum + m.owing, 0);
            const totalOwed = members.reduce((sum, m) => sum + m.totalOwing, 0);

            return {
                ...club.toJSON(),
                totalMembers: members.length,
                totalInvestment,
                totalInterest,
                owed,
                totalOwed,
                inHand: totalInvestment + totalInterest - owed
            };
        });

        res.json(enriched);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
});

// Create a new club
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

        res.status(201).json({ message: 'Club created successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
});

// Edit a club
router.patch('/:id', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' })
    }

    try {
        const club = await Club.findByPk(req.params.id);
        if (!club) {
            return res.json({ message: 'Club not found' })
        };

        if (club.userId !== req.user.id) {
            return res.json({ message: 'Not authorized to change name' })
        }

        club.title = title;
        await club.save();
        res.status(200).json({ message: 'Club renamed successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
});

// Delete a club
router.delete('/:id', async (req, res) => {
    const club = await Club.findByPk(req.params.id);
    if (!club) {
        return res.status(404).json({ message: 'Club not found' })
    };

    try {
        if (club.userId !== req.user.id) {
            return res.json({ message: 'Not authorized to delete' })
        }

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
        res.status(200).json({ message: 'Deleted club successfully' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
})

module.exports = router