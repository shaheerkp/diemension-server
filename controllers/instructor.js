import User from "../models/user";
import queryString from "query-string";
const stripe = require("stripe")(process.env.STRIPE_SECRET);
import Course from "../models/course";
export const makeInstructor = async (req, res) => {
  let doc;
  const user = await User.findById(req.user._id).exec();
  console.log("userrrrr", user);

  //create stripe accout if user have no account id
  if (!user.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: "jenny.rosen@example.com",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
    });

    doc = await User.findOneAndUpdate(
      { _id: req.user._id },
      { stripe_account_id: account.id }
    ).exec();

    console.log("updatesd docs if", doc);
  } else {
    doc = user;
    console.log("updatesd docs else", doc);
  }

  let accountLink = await stripe.accountLinks.create({
    account: doc.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: "account_onboarding",
  });

  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": user.email,
  });

  res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);

  //find user from db
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();

    const account = await stripe.accounts.retrieve(user.stripe_account_id);

    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorised");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      statusUpdated.password = undefined;
      res.json(statusUpdated);
    }
  } catch (error) {}
};

export const currentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).exec();
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor:req.user._id})                                     
      .sort({ createdAt: -1 })
      .exec();
      console.log(courses);
      res.json(courses)
  } catch (error) {
    console.log(error);
  }
};
 