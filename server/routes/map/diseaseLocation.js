const express = require('express');
const router = express.Router();

// const UserLocation = require('../../models/User'); // framers location when sign up  //const User = require("../models/User");
const DiseaseReport = require("../../models/contact"); // disease location when reporting   //const Contact = require("../models/contact");





// // get disease location from DB
router.get('/disease_locations', async (req, res) => {
  try {
    const diseaseReports = await DiseaseReport.find({});
    // console.log('Disease Reports:', diseaseReports);
    
    const locations = diseaseReports.map(report => ({
      disease: report.disease,
      category: report.category,
      location: report.location,
      // location: [report.location.lat, report.location.lng],   
      // intensity: report.dangerLevel, // Assuming dangerLevel is a field in DiseaseReport
    }));
    res.json(locations);
    console.log('successfully fetching locationssssss',locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetchinggggg disease locations' });
    console.error('Error fetching locationsssss:', err);
  }
});

router.get('/disease_loc', async (req, res) => {
  try {
    const disease_Reports = await DiseaseReport.find({});
    // console.log('Disease Reports:', diseaseReports);
    
    const locations = disease_Reports.map(report => ({
      disease: report.disease,
      category: report.category,
      location: report.location,
      // location: [report.location.lat, report.location.lng],   
      // intensity: report.dangerLevel, // Assuming dangerLevel is a field in DiseaseReport
    }));
    res.json(locations);
    console.log('successfully fetching locationssssss',locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetchinggggg disease locations' });
    console.error('Error fetching locationsssss:', err);
  }
});



module.exports = router;