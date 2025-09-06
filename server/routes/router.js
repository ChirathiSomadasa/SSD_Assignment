const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const router = express.Router();
const mongoose = require("mongoose");
const details = require("../models/detailSchema");
const Details = require("../models/detailSchema");

const pick = (obj, keys) =>
  Object.fromEntries(keys
    .filter(k => Object.prototype.hasOwnProperty.call(obj, k))
    .map(k => [k, obj[k]]));

const validateObjectId = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  next();
};

//add
router.post("/addDetails", requireAuth, async (req, res) => {
  const allowed = ["receiverName","phoneNumber","address","productType","productName","brand","amount","unit","price"];
  const data = pick(req.body, allowed);
  for (const k of allowed) {
    if (data[k] === undefined || data[k] === null || data[k] === "") {
      return res.status(400).json({ message: `Missing field: ${k}` });
    }
  }
  try {
    const created = await details.create({ ...data, createdBy: req.current_user.userId });
 // DB unique index prevents races
    return res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Phone number already exists" });
    return res.status(400).json({ message: "Validation error" });
  }
});
// router.post("/addDetails",requireAuth(), async (req, res) => {
//     console.log(req.body);
//     const {
//         receiverName,
//         phoneNumber,
//         address,
//         productType,
//         productName,
//         brand,
//         amount,
//         unit,
//         price,
// createdBy: req.user._id
//     } = req.body;

//     // Check if all required fields are filled
//     if ( !receiverName ||!phoneNumber || !address || !productType || !productName || !brand || !amount ||!unit || !price) {
//         return res.status(400).json("Please fill all the required fields.");
//     }

//     try {
//         // Check if the user with the given phone number already exists
//         const preDetails = await details.findOne({ phoneNumber: phoneNumber });
//         if (preDetails) {
//             return res.status(400).json("This user already exists.");
//         } else {
//             // Create a new details entry 
//             const addDetails = new details({
//                 receiverName,
//                 phoneNumber,
//                 address,
//                 productType,
//                 productName,
//                 brand,
//                 amount,
//                 unit,
//                 price
//             });
//             await addDetails.save();
//             return res.status(201).json(addDetails);
//         }
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }
// });


//delete
// router.delete('/details/:id',requireAuth(), async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deletedDetail = await details.findByIdAndDelete(id);
//         if (!deletedDetail) {
//             return res.status(404).json({ error: 'Detail not found' });
//         }
//         res.json({ message: 'Detail deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while deleting the detail' });
//     }
// });

//fetch a detail by id 
router.get('/details/:id',requireAuth, async (req, res) => {
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
// GET /getdetails
// Fetch user-specific details with pagination + server-side search
router.get('/getdetails', requireAuth, async (req, res) => {
  try {
    const userId = req.current_user.userId;
    const userRole = req.current_user.role;

    // Base query: normal users see only their own details
    let query = {};
    if (userRole !== 'admin') {
      query.createdBy = userId;
    }

    // Server-side search
    const search = req.query.search;
    if (search) {
      const regex = new RegExp(search, 'i'); // case-insensitive
      query.$or = [
        { receiverName: regex },
        { phoneNumber: regex },
        { address: regex },
        { productType: regex },
        { productName: regex },
        { brand: regex }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalDocs = await Details.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const detailsList = await Details.find(query)
      .select('receiverName phoneNumber address productType productName brand amount unit price status createdAt updatedAt')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      message: 'Details retrieved successfully',
      page,
      limit,
      totalDocs,
      totalPages,
      data: detailsList
    });

  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({
      message: 'An error occurred while fetching details',
      error: error.message
    });
  }
});



// Update a detail by ID
router.put("/details/:id", requireAuth, validateObjectId, async (req, res) => {
  const allowed = ["receiverName","phoneNumber","address","productType","productName","brand","amount","unit","price"];
  const $set = pick(req.body, allowed);
  try {
    const updated = await details.findByIdAndUpdate(
      req.params.id,
      { $set },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Detail not found" });
    res.json({ message: "Detail updated successfully", data: updated });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Phone number already exists" });
    res.status(500).json({ message: "Error updating detail" });
  }
});
// router.put('/details/:id',requireAuth(), async (req, res) => {
//     try {
//         const updatedDetail = await details.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );

//         if (!updatedDetail) {
//             return res.status(404).json({
//                 message: 'Detail not found'
//             });
//         }

//         res.status(200).json({
//             message: 'Detail updated successfully',
//             data: updatedDetail
//         });
//     } catch (error) {
//         console.error('Error updating detail:', error);
//         res.status(500).json({
//             message: 'Error updating detail',
//             error: error.message
//         });

        

//     }
// });


// REPLACE approve/reject with audit + RBAC:
router.put("/details/:id/approve" , requireAuth, requireRole("admin"), validateObjectId, async (req, res) => {
  const updated = await details.findByIdAndUpdate(
    req.params.id,
    { $set: { status: "approved", approvedBy: req.current_user.userId, approvedAt: new Date(), rejectedBy: null, rejectedAt: null } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Detail not found" });
  res.json({ message: "Detail approved successfully", data: updated });
});

router.put("/details/:id/reject",requireAuth, requireRole("admin"), validateObjectId, async (req, res) => {
  const updated = await details.findByIdAndUpdate(
    req.params.id,
    { $set: { status: "rejected", rejectedBy: req.current_user.userId, rejectedAt: new Date(), approvedBy: null, approvedAt: null } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Detail not found" });
  res.json({ message: "Detail rejected successfully", data: updated });
});

router.delete("/details/:id", requireAuth, validateObjectId, async (req, res) => {
  try {
    const detail = await details.findById(req.params.id);
    if (!detail) return res.status(404).json({ message: "Detail not found" });

    const userId = req.current_user.userId;
    const userRole = req.current_user.role;

    // Allow delete only if owner or admin
    if (detail.createdBy.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "You do not have permission to delete this detail" });
    }

    await details.findByIdAndDelete(req.params.id);
    res.json({ message: "Detail deleted successfully" });
  } catch (err) {
    console.error("Error deleting detail:", err);
    res.status(500).json({ message: "Error deleting detail", error: err.message });
  }
});

// // Approve a detail by ID
// router.put('/details/:id/approve',requireAuth('admin'), async (req, res) => {
//     try {
//         const updatedDetail = await details.findByIdAndUpdate(
//             req.params.id,
//             { status: 'approved' },
//             { new: true, runValidators: true }
//         );
//         if (!updatedDetail) {
//             return res.status(404).json({ message: 'Detail not found' });
//         }
//         res.status(200).json({ message: 'Detail approved successfully', data: updatedDetail });
//     } catch (error) {
//         res.status(500).json({ message: 'Error approving detail', error: error.message });
//     }
// });


// // Reject a detail by ID
// router.put('/details/:id/reject',requireAuth('admin'), async (req, res) => {
//     try {
//         const updatedDetail = await details.findByIdAndUpdate(
//             req.params.id,
//             { status: 'rejected' },
//             { new: true, runValidators: true }
//         );
//         if (!updatedDetail) {
//             return res.status(404).json({ message: 'Detail not found' });
//         }
//         res.status(200).json({ message: 'Detail rejected successfully', data: updatedDetail });
//     } catch (error) {
//         res.status(500).json({ message: 'Error rejecting detail', error: error.message });
//     }
// });


module.exports = router;
