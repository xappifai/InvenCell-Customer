import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Import bcrypt.js library
import User from "../Model/User.js"; // Make sure to import your User model correctly

export const signup = async (req, res) => {
  try {
    const { email, password, cnic, address, phoneNumber, name } = req.body;

    // Validate request body
    if (!email || !password || !cnic || !address || !phoneNumber || !name) {
      return res.status(400).send("Missing required fields");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create new user with encrypted password
    const newUser = new User({
      email,
      password: hashedPassword,
      cnic,
      address,
      phoneNumber,
      name,
    });
    await newUser.save();

    // Sign JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        cnic: newUser.cnic,
        address: newUser.address,
        phoneNumber: newUser.phoneNumber,
        name: newUser.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send token in response
    res.json({ token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
};
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email }).exec(); // Add .exec() to execute the query immediately
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // Log the user object to check if ffllaagg is being retrieved correctly

    // Check if account is suspended

    if (user.ffllaagg === false) {
      // Ensure correct property name here

      return res
        .status(403)
        .send("Your account is suspended. Contact admin for more info.");
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        cnic: user.cnic,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send token in response with status 200
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).send("Error signing in");
  }
};

export const forgotpassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if account is suspended
    if (user.ffllaagg === false) {
      return res.status(403).send("Account suspended");
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Old password does not match");
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).send("Password updated successfully");
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const protectedRoute = (req, res) => {
  // Middleware to verify token will go here
  res.send("This is a protected route.");
};
