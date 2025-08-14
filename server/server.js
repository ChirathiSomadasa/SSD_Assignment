const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const dbConfig = require("./config/dbConfig");
const mongoose = require("mongoose");
const ContactModel = require('./models/contact');
const Prediction = require('./models/prediction');
const User = require('./models/User');
const router = require("./routes/router");

var predictionRoute = require("./routes/prediction_route");
var userRoute = require("./routes/user_route");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

// Routes
app.use(router);

// Authentication Middleware
app.use(async (req, res, next) => {
    const email = req.body.auth_email;
    const password = req.body.auth_password;

    if (email && password) {
        try {
            const user = await User.findOne({ email: email, password: password });
            if (!user) {
                return res.status(400).json({ status: "invalid_user", message: "This user is invalid." });
            }
            req.current_user = { user_id: user._id, user: user };
            next();
        } catch (error) {
            return res.status(500).json({ error: "Error during authentication" });
        }
    } else {
        req.current_user = null;
        next();
    }
});

// POST route to handle form submission for predictions
app.post('/api/predictions', async (req, res) => {
    try {
        const newPrediction = new Prediction(req.body);
        await newPrediction.save();
        res.status(200).json({ message: 'Prediction saved successfully!', newPrediction });
    } catch (error) {
        console.error('Error saving prediction:', error);
        res.status(500).json({ error: 'Failed to save prediction' });
    }
});

// Fetch all contacts
app.get('/', async (req, res) => {
    try {
        const contacts = await ContactModel.find({});
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problems' });
    }
});

// Add a problem
app.post("/AddProblem", async (req, res) => {
    try {
        const newProblem = new ContactModel(req.body);
        await newProblem.save();
        res.status(200).json({ message: 'Problem added successfully!', data: newProblem });
    } catch (err) {
        res.status(500).json({ error: 'Error adding problem' });
    }
});

// Update a problem
app.put("/UpdateContact/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProblem = await ContactModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProblem);
    } catch (err) {
        res.status(500).json({ error: 'Error updating problem' });
    }
});

// Delete a problem
app.delete("/deleteContact/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await ContactModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting problem' });
    }
});

// Fetch a single problem by ID
app.get('/getContact/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById(id);
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problem' });
    }
});

// Add a solution to a problem
app.put('/addSolution/:id', async (req, res) => {
    const { id } = req.params;
    const { solution } = req.body;

    try {
        const contact = await ContactModel.findById(id);
        if (!contact) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        contact.solutions.push({ solution });
        await contact.save();
        res.status(200).json({ message: 'Solution added successfully', data: contact });
    } catch (err) {
        res.status(500).json({ error: 'Error adding solution. Please try again.' });
    }
});

// Fetch solutions for a problem
app.get('/getSolution/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById(id).populate('solutions');
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problem' });
    }
});

// Use the prediction and user routes
app.use("/prediction", predictionRoute);
app.use("/user", userRoute);

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Node server started at port ${port}`));


const diseaseLocationRoutes = require('./routes/map/diseaseLocation');
app.use('/api', diseaseLocationRoutes);
const locationNotificationRoutes = require('./routes/map/notification');
app.use('/api_loc', locationNotificationRoutes);
const notificationRoute =require('./routes/map/notification_route');
app.use("/notification", notificationRoute);