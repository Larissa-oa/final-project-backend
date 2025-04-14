const {Schema, model} = require("mongoose")


const  TypeSchema = new Schema ({
type: {
type: String, 
required: true,
}, 
image: {
type: String,
required: true,
}
});

const TypeModel = model( "Type", TypeSchema)
module.exports = TypeModel;