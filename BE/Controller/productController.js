const Product = require('../Models/Product')

const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body)
    product.save()
      .then((newProduct) => {
        res.status(200).json(newProduct)
      })
  } catch (error) {
    console.log(error)
  }
}

const getAllProduct = async (req, res) => {
  try {
    Product.find({})
      .then((products) => {
        res.status(200).json(products)
      })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { addProduct, getAllProduct }