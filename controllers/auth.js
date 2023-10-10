const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  //Validation Check
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Kindly Provide All the Values" });
  }
  //Hashing the Password
  const hashedPassword = await bcrypt.hash(password, 10);
  //creating user in Database
  const user = await User.create({ name, email, password: hashedPassword });
  //generating token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  res.status(201).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide all Values" });
  }

  //finding the user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ msg: "Invalid Email or Password" });
  }

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    return res.status(401).json({ msg: "Invalid Email or Password" });
  }

  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  res.status(200).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
