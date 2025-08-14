const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema({
    receiverName: { 
        type: String, 
        required: true, 
        maxlength: 100 
    },
    phoneNumber: { 
        type: String, 
        required: true, 
        match: /^\d{10}$/  // Regex for 10-digit phone numbers
    },
    address: { 
        type: String, 
        required: true, 
        maxlength: 250 
    },
    productType: { 
        type: String, 
        required: true 
    },
    productName: { 
        type: String, 
        required: true 
    },
    brand: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    unit: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    }
});


detailSchema.index({ phoneNumber: 1 });

const Detail = mongoose.model("Detail", detailSchema);
module.exports = Detail;
