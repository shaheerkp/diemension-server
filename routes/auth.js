import express from "express";
const router=express.Router();
import {currentUser, forgotPassword, register, resetPassword, signin, signout} from "../controllers/auth.js"
import { requireSignin } from "../middlewares/index.js";

router.post('/register',register)
router.post('/signin',signin)
router.get('/signout',signout)
router.get('/current-user',requireSignin,currentUser)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)

module.exports = router   
 