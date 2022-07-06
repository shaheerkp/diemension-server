import mongoose from "mongoose";
const { Schema } = mongoose;
const {ObjectId}=Schema



const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: { 
      type: String,
      required: true,
      min: 5,
      max: 64,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Instructor", "Admin"],
    },
    passwordResetCode:{
      type:String, 
      default:"asdas"
    },
    courses:[
      {type:ObjectId,ref:"Course"}
    ],
    stripeSession: {},
    stripe_account_id: "",
    stripe_seller: {},
  }, 

  {
    timestamps: true,
  }
);

export default mongoose.model("User",userSchema);
