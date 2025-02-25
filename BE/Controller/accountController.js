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
  try {
    Account.find({})
      .then((accounts) => {
        res.status(200).json(accounts)
      })
  } catch (error) {
    console.log(error)
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