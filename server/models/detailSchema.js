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
        match: /^\d{10}$/,
        unique: true ,
        index: true  
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
        required: true,
        min: 1  
    },
    unit: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true ,
        min: 0 
    },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",                  // track who created it
      required: true
    }
  },
  { 
    timestamps: true,               // adds createdAt + updatedAt
    strict: "throw"                 // 🚨 prevents mass-assignment
});


detailSchema.index({ phoneNumber: 1 }, { unique: true });

const Detail = mongoose.model("Detail", detailSchema);
module.exports = Detail;
