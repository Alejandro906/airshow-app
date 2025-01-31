const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        require : true, 
    },
    password : {
        type : String, 
        required : true, 
    }, 
    hasTicket : {
        type : Boolean, 
        default : false,
    },
    ticketId: { // Reference to the Airshow model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        default: null,
    },
});

module.exports = mongoose.model("User", UserSchema);
