
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const PlantSchema = new Schema(
  {
    name: {
        type:String, 
        required:true,
        unique:true
    },
    scientific_name: {
        type: String,
        required:true
    }, 
    image: {
        type: String,
        required:true
    },
    basic_care: {
        type: String,
        required:true
    },
    watering_instructions: {
        type: String,
        required:true
    }
}
);

const PlantModel = model("Plant", PlantSchema);

module.exports = PlantModel;

