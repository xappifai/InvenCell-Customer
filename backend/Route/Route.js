import express from "express";
import {
  signin,
  signup,
  forgotpassword,
} from "../Controller/UserController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/forgot", forgotpassword);


export default router;
