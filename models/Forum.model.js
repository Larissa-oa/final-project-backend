const {Schema, model} = require("mongoose")


const  ForumSchema = new Schema ({
title: {
type: String, 
required: true,
}, 

image: {
type: String,
required: true,
},

description: {
type: String,
required: true,
},

location: {
type: [String]
},

author: {
    type: Schema.Types.ObjectId,
    ref: "User"
},

reply: {
type: [String],
}
})

const ForumModel = model( "forum", ForumSchema)
module.exports = ForumModel