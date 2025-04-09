const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const UserModel = model("User", UserSchema);

module.exports = UserModel;
