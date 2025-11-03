const { Club } = require('../models/Relationships');

module.exports = async (req, res, next) => {
    const clubId = req.headers['clubid'];
    if (!clubId) {
        return res.status(400).json({ message: 'Club id required in headers' })
    };

    try {
        const club = await Club.findByPk(clubId);
        if (!club) {
            return res.status(404).json({ messege: 'Club not found' })
        };
        
        req.club = club
        next()
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}