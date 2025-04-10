const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String, 
      required:[true, "username is required"],
      unique: true,
      trim: true,
    },
    profileImage:{
    type: String
  },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {    
    timestamps: true
  }
);

const UserModel = model("User", UserSchema);

module.exports = UserModel;
