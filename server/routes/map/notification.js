const express = require('express');
const router = express.Router();

const UserLocation = require('../../models/User'); // framers location when sign up  //const User = require("../models/User");
const DiseaseReport = require("../../models/contact"); // disease location when reporting   //const Contact = require("../models/contact");





// // get disease location from DB
router.get('/user_locations', async (req, res) => {
    try {
        const user_loc = await UserLocation.find({});
        console.log('user Locationsssss:', user_loc);
        
        const locations = user_loc.map(report => ({
            mobile_number: report.mobile_number,
            location: report.city,
            // category: report.category,
            // location: [report.location.lat, report.location.lng],   
            // intensity: report.dangerLevel, // Assuming dangerLevel is a field in DiseaseReport
        }));
        res.json(locations);
        console.log('successfully fetching user locationssssss',locations);
    } catch (err) {
            res.status(500).json({ message: 'Error fetching user locations' });
            console.error('Error fetching userrrr locationsssss:', err);
    }
});

router.get('/disease_location', async (req, res) => {
    try {
            const disease_Reports = await DiseaseReport.find({});
            // console.log('Disease Reports:', diseaseReports);
            
            const locations = disease_Reports.map(report => ({
            // disease: report.disease,
            // category: report.category,
            location: report.location,
            // location: [report.location.lat, report.location.lng],   
            // intensity: report.dangerLevel, // Assuming dangerLevel is a field in DiseaseReport
        }));
        res.json(locations);
        console.log('successfully fetching locationssssss',locations);
    } catch (err) {
            res.status(500).json({ message: 'Error fetching disease locations' });
            console.error('Error fetching locationsssss:', err);
    }
});



module.exports = router;