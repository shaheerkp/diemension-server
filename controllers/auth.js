import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";

const awsConfiq={
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion:process.env.AWS_API_VERSION
};

const ses = new AWS.SES(awsConfiq);

export const register = async (req, res) => {
  console.log("register");
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("User already exsist");

    //hash password
    const hashedPassword = await hashPassword(password);

    //register
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    console.log("Saved user", user);
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error. Try again");
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    const match = await comparePassword(password, user.password);
    console.log("try", password, user.password, match);
    if (!match) return res.status(400).json({ mes: "Invalid password" });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETE, {
      expiresIn: "7d",
    });

    user.password = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      // secure:true,
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ msg: "Error.try again" });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ msg: "logout Successfull" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error.try again" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("Curent User", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    console.log("__________________", email);
    const user = await User.findOneAndUpdate(
      { email: email },
      { passwordResetCode: shortCode }
    );
    console.log("database user", user);
    if (!user) return res.status(400).send("User not found");

    const params = {
      Destination: {
        ToAddresses: [email], // Email address/addresses that you want to send your email
      },

      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<html><body><h1>Dimensions</h1><p style='color:red'>Password reset</p>code : ${shortCode} <p></p></body></html>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "Password reset code",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Password Reset mail",
        },
      },
      Source: "kpshaheer11@gmail.com",
    };

    const sendEmail = ses.sendEmail(params).promise();

    sendEmail
      .then((data) => {
        console.log("email submitted to SES", data);
        res.json({ ok: true });
      })
      .catch((error) => {
        console.log(error);
      });

    res.send({ ok: true });
  } catch (error) {
    console.log("error", error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const hashedPassword = await hashPassword(newPassword);
    const user = await User.findOneAndUpdate(
      { email, passwordResetCode: code },
      { password: hashedPassword, passwordResetCode: "" }
    ).exec();
    res.json({ok:true})
  } catch (error) {
    console.log("errorrrr",error);
    return res.status(400).send("Error try again")

  }
};
