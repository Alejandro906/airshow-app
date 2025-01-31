const express = require('express');
const router = express.Router();
const Airshow = require('../models/Airshow');
const Ticket = require('../models/Ticket');

// GET ONE AIRSHOW
router.get('/find/:id', async (req, res, next) => {
    try {
        const sections = ['left', 'center', 'right'];

        const featuredAirshow = await Airshow.findById(req.params.id).populate('tickets');

        const countTickets = await Promise.all(
            sections.map(async (section) => {
                const count = await Ticket.countDocuments({
                    section, 
                    airshowId: req.params.id, 
                    available: true
                });
                return { section, count };
            })
        );

        res.render('featuredAirshow', { featuredAirshow, countTickets });
    } catch (err) {
        console.log('Error getting airshow', err);
        next(err);
    }
});

module.exports = router;
