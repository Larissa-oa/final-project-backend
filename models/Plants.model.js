
const { Schema, model } = require("mongoose");


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
    },
    type: {
        type: String, 
    }
}
);

const PlantModel = model("Plant", PlantSchema);

module.exports = PlantModel;

