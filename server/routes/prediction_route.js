// routes/prediction_route.js

const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction"); // Make sure this is the correct path
const User = require("../models/User");

// Middleware to verify authentication
const authenticate = (req, res, next) => {
    if (!req.current_user) {
        return res.status(401).json({
            status: "error",
            message: "Authentication required"
        });
    }
    next();
};

// Middleware to verify admin
const authorizeAdmin = (req, res, next) => {
    if (!req.current_user || req.current_user.user.user_type !== "admin") {
        return res.status(403).json({
            status: "error",
            message: "Access denied. Admins only."
        });
    }
    next();
};

// Validate prediction input
const validatePrediction = (req, res, next) => {
    const { variety, estimatedYield, yieldVariability, geographicLocation, irrigationPractices, weatherConditions } = req.body;

    if (!variety || !estimatedYield || !yieldVariability || !geographicLocation || !irrigationPractices || !weatherConditions) {
        return res.status(400).json({
            status: "error",
            message: "All fields are required: variety, estimatedYield, yieldVariability, geographicLocation, irrigationPractices, weatherConditions"
        });
    }

    next();
};

// CREATE a new prediction (Authenticated user only)
router.post('/api/predictions', authenticate, validatePrediction, async (req, res) => {
    try {
        const newPrediction = new Prediction({
            user_id: req.current_user.user_id, // Server-side assignment — safe
            ...req.body
        });

        await newPrediction.save();
        res.status(201).json({
            status: "success",
            message: "Prediction created successfully",
            data: newPrediction
        });
    } catch (error) {
        console.error('Error creating prediction:', error);
        res.status(500).json({
            status: "error",
            message: "Error creating prediction",
            error: error.message
        });
    }
});

// GET all predictions for the logged-in user (Authenticated)
router.get('/api/predictions', authenticate, async (req, res) => {
    try {
        const predictions = await Prediction.find({ user_id: req.current_user.user_id });
        res.status(200).json({
            status: "success",
            message: "Predictions retrieved successfully",
            data: predictions
        });
    } catch (error) {
        console.error('Error retrieving predictions:', error);
        res.status(500).json({
            status: "error",
            message: "Error retrieving predictions",
            error: error.message
        });
    }
});

// GET a single prediction by ID (Owner or Admin)
router.get('/api/predictions/:id', authenticate, async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            return res.status(404).json({
                status: "error",
                message: "Prediction not found"
            });
        }

        // Check ownership or admin
        if (prediction.user_id !== req.current_user.user_id && req.current_user.user.user_type !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Access denied"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Prediction retrieved successfully",
            data: prediction
        });
    } catch (error) {
        console.error('Error retrieving prediction:', error);
        res.status(500).json({
            status: "error",
            message: "Error retrieving prediction",
            error: error.message
        });
    }
});

// UPDATE a prediction (Owner only)
router.put('/api/predictions/:id', authenticate, validatePrediction, async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            return res.status(404).json({
                status: "error",
                message: "Prediction not found"
            });
        }

        if (prediction.user_id !== req.current_user.user_id) {
            return res.status(403).json({
                status: "error",
                message: "Access denied"
            });
        }

        const updatedPrediction = await Prediction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: "success",
            message: "Prediction updated successfully",
            data: updatedPrediction
        });
    } catch (error) {
        console.error('Error updating prediction:', error);
        res.status(500).json({
            status: "error",
            message: "Error updating prediction",
            error: error.message
        });
    }
});

// DELETE a prediction (Owner only)
router.delete('/api/predictions/:id', authenticate, async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            return res.status(404).json({
                status: "error",
                message: "Prediction not found"
            });
        }

        if (prediction.user_id !== req.current_user.user_id) {
            return res.status(403).json({
                status: "error",
                message: "Access denied"
            });
        }

        await Prediction.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
            message: "Prediction deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting prediction:', error);
        res.status(500).json({
            status: "error",
            message: "Error deleting prediction",
            error: error.message
        });
    }
});

// ADMIN: Get all predictions
router.get('/api/admin/predictions', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const predictions = await Prediction.find({}).populate('user_id', 'first_name last_name email');
        res.status(200).json({
            status: "success",
            message: "All predictions retrieved successfully",
            data: predictions
        });
    } catch (error) {
        console.error('Error retrieving all predictions:', error);
        res.status(500).json({
            status: "error",
            message: "Error retrieving predictions",
            error: error.message
        });
    }
});

module.exports = router;