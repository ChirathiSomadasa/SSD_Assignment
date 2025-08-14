var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationSchema = new Schema(
    {
        email: { type: String, required: true },
        disease: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        location: { type: String, required: true },
        timestamp: { type: Date, default: Date.now } // Add this field to track the time of creation
    }
);

var model = mongoose.model("notification", NotificationSchema);
module.exports = model;
