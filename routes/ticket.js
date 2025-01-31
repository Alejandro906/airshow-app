const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Airshow = require('../models/Airshow');
const User = require('../models/User'); 

// GET TICKETS FOR A SPECIFIC AIRSHOW BY SELECTED SECTION
router.get('/getBySection/:airshowID/:section', async (req, res, next) => {
    try {
        const section = req.params.section;
        const airshowId = await Airshow.findById(req.params.airshowID);

        // Find all available economy class tickets
        const getAvailableTicketEconomy = await Ticket.find({
            section: section,
            airshowId: airshowId.id,
            available: true,
            class: "economy"
        });

        // Find all available business class tickets
        const getAvailableTicketBusiness = await Ticket.find({
            section: section,
            airshowId: airshowId.id,
            available: true,
            class: "business"
        });

        const getAvailableCount = await Ticket.countDocuments({
            section: section,
            airshowId: airshowId.id,
            available: true,
        });

        res.render('tickets', { getAvailableTicketEconomy, getAvailableTicketBusiness, airshowId, getAvailableCount});
    } catch (err) {
        console.error('Error fetching tickets by section:', err);
        next(err);
    }
});

// TOGGLE TICKET AVAILABILITY STATUS GIVES A TICKET TO A USER
router.post('/ticketStatus/:airshowID/:ticketID', async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const getTicket = await Ticket.findById(req.params.ticketID);
            const getAirshow = await Airshow.findById(req.params.airshowID);
            const getUserInfo = await User.findById(req.user.id);

            if (!getUserInfo.hasTicket) {
                if (getTicket && getTicket.available) {
                    // Toggle availability and assign ticket atomically
                    getTicket.available = false;
                    getTicket.owner = req.user.username;
                    await getTicket.save();
                    
                    getUserInfo.hasTicket = true;
                    getUserInfo.ticketId = getTicket._id;
                    await getUserInfo.save();

                    res.redirect('/');
                } else {
                    res.status(404).send('Ticket not available.');
                }
            } else {
                res.status(403).send('You already have a ticket.');
            }
        } catch (err) {
            console.error('Error updating ticket status:', err);
            next(err);
        }
    } else {
        req.flash('msg', 'You must log in first')
        res.redirect('/auth/login');
    }
});

// GET TICKET BY ID FOR A SPECIFIC AIRSHOW
router.get('/find/:airshowID/:ticketID', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketID);
        const airshow = await Airshow.findById(req.params.airshowID);

        // Render ticket information
        res.render('ticketInfo', { ticket, airshow });
    } catch (err) {
        console.error('Error fetching ticket information:', err);
        next(err);
    }
});

module.exports = router;
