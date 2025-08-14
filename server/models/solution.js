var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Solution schema with a reference to the contact
var SolutionSchema = new mongoose.Schema(
  {
    disease: { type: String, required: true },
    solution: { type: String, required: true },
    contacts: { type: Schema.Types.ObjectId, ref: 'contacts', required: true } , // Reference to contact's ID
  }
);

// Create the model
var SolutionModel = mongoose.model("solutions", SolutionSchema);
module.exports = SolutionModel;
