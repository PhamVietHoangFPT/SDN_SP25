const Account = require("../Models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getProfile = async (req, res) => {
  try {
    if (!req.account || !req.account.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { email } = req.account; // Lấy email từ token

    const account = await Account.findOne({ email });
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        username: account.username,
        email: account.email,
        dateOfBirth: account.dateOfBirth,
        gender: account.gender,
        phoneNumber: account.phoneNumber,
        address: account.address,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const { email, username, dateOfBirth, gender, phoneNumber, address } =
      req.body;

    const updatedAccount = await Account.findOneAndUpdate(
      { email },
      { $set: { username, dateOfBirth, gender, phoneNumber, address } },
      { new: true }
    );

    if (!updatedAccount) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    const token = jwt.sign(
      {
        id: updatedAccount._id,
        email: updatedAccount.email,
        role: updatedAccount.role,
        username: updatedAccount.username,
        dateOfBirth: updatedAccount.dateOfBirth,
        gender: updatedAccount.gender,
        phoneNumber: updatedAccount.phoneNumber,
        address: updatedAccount.address,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const editPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const account = await Account.findOne({ email });
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    if (!bcrypt.compareSync(oldPassword, account.password)) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updatedAccount = await Account.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedAccount) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, editProfile, editPassword };
