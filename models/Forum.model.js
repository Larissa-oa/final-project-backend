const {Schema, model} = require("mongoose")


const  ForumSchema = new Schema ({
title: {
type: String, 
required: true,
}, 

image: {
type: String,
// required: true,
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

reply: [
    {
      text: {
        type: String,
        required: true,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {timestamps: true})

const ForumModel = model( "forum", ForumSchema)
module.exports = ForumModel