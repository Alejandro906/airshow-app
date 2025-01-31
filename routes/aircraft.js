const express = require('express')
const router = express.Router()
const Aircraft = require('../models/Aircraft');
const User = require('../models/User');

//GET ONE AIRCRAFT 
router.get('/find/:id', async (req, res) => {
    try{
        const aircraftInfo = await Aircraft.findById(req.params.id)
        res.render('aircraftInfo', {aircraftInfo})
    }catch(err){
        console.log('Error getting Aircraft')
        next(err)
    }
});

// GET ALL AIRCRAFT FROM THE SELECTED TYPE
router.get('/type/:type', async (req, res, next) => {
    const getAircraftType = req.params.type;
    try {
        const aircraftDocs = await Aircraft.find({ type: getAircraftType });
        const aircraftType = aircraftDocs.map(doc => doc.toObject()); // Convert to plain objects

        res.render('aircraftByType', { aircraftType, getAircraftType});
    } catch (err) {
        next(err);
    }
});

module.exports = router;