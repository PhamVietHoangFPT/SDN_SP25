const Articles = require("../Models/Articles");

// get all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Articles.find({});

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// get article by id
const getArticleById = async (req, res) => {
  try {
    const articles = Articles.findById(req.params.id);
    if (!articles) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// add article
const addArticle = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    const newArticle = new Articles({ title, content, category, image });
    const article = await newArticle.save();

    res
      .status(201)
      .json({ message: "Article added success", article: article });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// update article
const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Articles.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updateArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article updated success", updateArticle });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

// delete article

const deleteArticle = async (req, res) => {
  try {
    const deleteArticle = Articles.findByIdAndDelete(req.params.id);
    if (!deleteArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted success" });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};
module.exports = {
  getAllArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
};
