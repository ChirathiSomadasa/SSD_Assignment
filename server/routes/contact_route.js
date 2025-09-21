var express = require("express");
var router = express.Router();
const Contact = require("../models/contact");

 

// Fetch all contacts
router.get('/api', async (req, res) => {
    try {
        const contacts = await ContactModel.find({});
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problems' });
    }
});

// Add a problem
router.post("/api/AddProblem", async (req, res) => {
    try {
        const newProblem = new ContactModel(req.body);
        await newProblem.save();
        res.status(200).json({ message: 'Problem added successfully!', data: newProblem });
    } catch (err) {
        res.status(500).json({ error: 'Error adding problem' });
    }
});

// Update a problem
router.put("/api/UpdateContact/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProblem = await ContactModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProblem);
    } catch (err) {
        res.status(500).json({ error: 'Error updating problem' });
    }
});

// Delete a problem
router.delete("/api/deleteContact/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await ContactModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting problem' });
    }
});

// Fetch a single problem by ID
router.get('/api/getContact/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById(id);
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problem' });
    }
});

// Add a solution to a problem
router.put('/api/addSolution/:id', async (req, res) => {
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
router.get('/api/getSolution/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await ContactModel.findById(id).populate('solutions');
        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching problem' });
    }
});

module.exports = router;
