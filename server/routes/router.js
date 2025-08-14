const express = require("express");
const router = express.Router();
const details = require("../models/detailSchema");
const Details = require("../models/detailSchema");



//add
router.post("/addDetails", async (req, res) => {
    console.log(req.body);
    const {
        receiverName,
        phoneNumber,
        address,
        productType,
        productName,
        brand,
        amount,
        unit,
        price
    } = req.body;

    // Check if all required fields are filled
    if ( !receiverName ||!phoneNumber || !address || !productType || !productName || !brand || !amount ||!unit || !price) {
        return res.status(400).json("Please fill all the required fields.");
    }

    try {
        // Check if the user with the given phone number already exists
        const preDetails = await details.findOne({ phoneNumber: phoneNumber });
        if (preDetails) {
            return res.status(400).json("This user already exists.");
        } else {
            // Create a new details entry 
            const addDetails = new details({
                receiverName,
                phoneNumber,
                address,
                productType,
                productName,
                brand,
                amount,
                unit,
                price
            });
            await addDetails.save();
            return res.status(201).json(addDetails);
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


//delete
router.delete('/details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDetail = await details.findByIdAndDelete(id);
        if (!deletedDetail) {
            return res.status(404).json({ error: 'Detail not found' });
        }
        res.json({ message: 'Detail deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the detail' });
    }
});

//fetch a detail by id 
router.get('/details/:id', async (req, res) => {
    try {
        const detail = await details.findById(req.params.id);
        if (!detail) {
            return res.status(404).json({ message: 'Detail not found' });
        }
        res.status(200).json({
            message: 'Detail retrieved successfully',
            data: detail
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving detail', error: error.message });
    }
});

// Fetch all details
router.get('/getdetails', async (req, res) => {
    try {
        const Detail = await details.find(); // Fetch all details from the database
        res.status(200).json({
            message: 'Details retrieved successfully',
            data: Detail
        }); // Send the details as a JSON response
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({
            message: 'An error occurred while fetching details',
            error: error.message
        });
    }
});

// Update a detail by ID
router.put('/details/:id', async (req, res) => {
    try {
        const updatedDetail = await details.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDetail) {
            return res.status(404).json({
                message: 'Detail not found'
            });
        }

        res.status(200).json({
            message: 'Detail updated successfully',
            data: updatedDetail
        });
    } catch (error) {
        console.error('Error updating detail:', error);
        res.status(500).json({
            message: 'Error updating detail',
            error: error.message
        });

        

    }
});

// Approve a detail by ID
router.put('/details/:id/approve', async (req, res) => {
    try {
        const updatedDetail = await details.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true, runValidators: true }
        );
        if (!updatedDetail) {
            return res.status(404).json({ message: 'Detail not found' });
        }
        res.status(200).json({ message: 'Detail approved successfully', data: updatedDetail });
    } catch (error) {
        res.status(500).json({ message: 'Error approving detail', error: error.message });
    }
});


// Reject a detail by ID
router.put('/details/:id/reject', async (req, res) => {
    try {
        const updatedDetail = await details.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true, runValidators: true }
        );
        if (!updatedDetail) {
            return res.status(404).json({ message: 'Detail not found' });
        }
        res.status(200).json({ message: 'Detail rejected successfully', data: updatedDetail });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting detail', error: error.message });
    }
});


module.exports = router;
