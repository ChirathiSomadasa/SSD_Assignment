var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var ContactSchema = new mongoose.Schema(
    {
        disease: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        location: { type: String, required: true }, 
        solutions: [{ solution: { type: String }, createdAt: { type: Date, default: Date.now } }] // Array of solutions

               
    }
);

var ContactModel = mongoose.model("contacts", ContactSchema);
module.exports = ContactModel;

 
