const Account = require('../Models/Account')

const addAccount = async (req, res) => {
  try {
    const account = new Account(req.body)
    account.save()
      .then((newAccount) => {
        res.status(200).json(newAccount)
      })
  } catch (error) {
    console.log(error)
  }
}

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

module.exports = { addAccount, getAllAccount, deleteAccount }