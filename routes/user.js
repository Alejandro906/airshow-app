const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Airshow = require('../models/Airshow');
const User = require('../models/User');

// GET THE USER'S TICKET FROM INVENTORY
router.get('/findMyTicket/:ticketId', async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const getTicket = await Ticket.findById(req.params.ticketId);
            if (getTicket && getTicket.owner === req.user.username) {
                const getAirshowPertainToTicket = await Airshow.findById(getTicket.airshowId);
                res.render('ticketInventory', { getTicket, getAirshowPertainToTicket });

            } else {
                res.status(403).send('You are not authorized to view this ticket.');
            }
        } catch (err) {
            next(err);
        }
    } else {
        res.status(403).send('You are not authenticated.');
    }
});

//RETURN THE TICKET FROM USER TO THE AIRHSOW
router.post('/returnTicket/:ticketId', async (req, res) => {
    try{
        // Find the ticket by ID
        const ticket = await Ticket.findById(req.params.ticketId);

        // Ensure the ticket exists and the user owns it
        if (!ticket || req.user.ticketId.toString() !== req.params.ticketId) {
            return res.status(403).send("You do not own this ticket or ticket doesn't exist.");
        }
        await Ticket.updateOne(
            { _id : req.params.ticketId}, 
            {$set : {available : true, } }
        )
        await User.updateOne(
            {_id : req.user.id},
            {$set : {hasTicket : false, ticketId : null}} //un reference the ticket from user so user doesnt have a ticket
        )
        res.redirect('/')
    }catch(err){
        next(err)
    }
})

module.exports = router;