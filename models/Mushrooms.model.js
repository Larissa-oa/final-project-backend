
const { Schema, model } = require("mongoose");


const MushroomSchema = new Schema(
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
    ideal_environment: {
        type: String,
        required:true
    },
    edible: {
        type: String,
        required: true
    }
}
);

const MushroomModel = model("Mushroom", MushroomSchema);

module.exports = MushroomModel;

