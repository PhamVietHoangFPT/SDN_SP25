const Account = require('../Models/Account')

const addAccount = async (req, res) => {
  try {
    // Define allowed fields
    const { email, username, dateOfBirth, gender, phoneNumber, address, password, role } = req.body;

    // Check for required fields
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Please fill in required fields" });
    }
    // Check if username already exists
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create account with controlled fields
    const accountData = {
      email,
      username,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
      password,
      role// Ensure this is hashed in the model or middleware
    };

    const account = new Account(accountData);
    const newAccount = await account.save();

    res.status(201).json({ data: newAccount });
  } catch (error) {
    console.error("Error adding account:", error);
    res.status(500).json({
      message: "Server error when adding account",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getAllAccount = async (req, res) => {
  const searchValue = req.query;
  const pageNumber = parseInt(searchValue.pageNumber) || 1;
  const pageSize = parseInt(searchValue.pageSize) || 12;
  const username = searchValue.username || "";
  // Xây dựng bộ lọc
  const filter = {};
  if (username) filter.username = { $regex: username, $options: "i" }; // Tìm kiếm theo tên không phân biệt hoa thường

  try {
    const accounts = await Account.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await Account.countDocuments(filter); // Tổng số sản phẩm

    res.json({
      accounts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / pageSize),
      totalItems: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when retrieving accounts" });
  }
}

const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ message: "No Account Found" });
    }
    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error when retrieving account" });
  }
};
const mongoose = require('mongoose');

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid account ID" });
    }

    // Define allowed fields to update
    const { email, dateOfBirth, gender, phoneNumber, address } = req.body;
    const updateData = {
      ...(email && { email }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(gender !== undefined && { gender }), // Allow falsey values like false
      ...(phoneNumber && { phoneNumber }),
      ...(address && { address }),
    };

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }
    // Update the account
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Run schema validators
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({ data: updatedAccount });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({
      message: "Server error when updating account",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
const deleteAccount = async (req, res) => {
  try {
    const deleteAccount = await Account.findByIdAndDelete(req.params.accountID)
    if (!deleteAccount) {
      res.status(404).json({ message: 'Not found!' })
    } else {
      res.json({ message: 'Account deleted!' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { addAccount, getAllAccount, deleteAccount, getAccountById, updateAccount }