const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    section : {
        type : String, 
        enum : ['left', 'center', 'right'], 
        required : true, 
    },
    desc : {
        type : String, 
        required : true, 
    },
    available : {
        type : Boolean, 
        default : true,
    },
    owner : {
        type : String, 
        default : null,
    },
    class : {
        type : String, 
        enum : ['economy', 'business'], 
        required : true, 
    },
    airshowId: { // Reference to the Airshow model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airshow',
        required: true,
    }
});

module.exports = mongoose.model("Ticket", TicketSchema);

/* ADD owner attribuite and assign it to the user that got the ticket so only if your the onwer you have
access to this route in the user.js router = /findMyTicket/:ticketId, because right now everyone has access
also have to add class = either economy, or business */