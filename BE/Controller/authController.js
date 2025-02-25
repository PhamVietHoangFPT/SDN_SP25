const Account = require('../Models/Account')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
    const { username, password, dateOfBirth, email, phoneNumber, gender } = req.body

    if (!username || !password || !dateOfBirth || !email || !phoneNumber) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    const user = await Account.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });
    if (user) {
      return res.status(400).json({ message: 'Email or phone number is used!' })
    }
    const newUser = new Account({
      username: username,
      password: password,
      // password: bcrypt.hashSync(password, parseInt(process.env.HASHED_KEY)),
      dateOfBirth: dateOfBirth,
      email: email,
      phoneNumber: phoneNumber,
      gender: gender
    })
    newUser.save()
      .then((newUser) => {
        res.status(200).json(newUser)
      })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const login = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    const user = await Account.findOne({ username: req.body.username })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    // const matchPassword = await bcrypt.compare(req.body.password, user.password)
    const matchPassword = req.body.password === user.password
    if (!matchPassword) {
      return res.status(400).json({ message: 'Incorrect password' })
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        point: user.point,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address,
        gender: user.gender,
        birthday: user.dateOfBirth
      },
      process.env.ACCESS_TOKEN,
      {
        algorithm: process.env.ALGORITHM,
        expiresIn: process.env.EXPIRES_IN
      }
    )
    return res.status(200).json({ token: token })

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { register, login }