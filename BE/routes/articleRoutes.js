const express = require("express");
const {
  getAllArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
} = require("../Controller/articleController");
const articleRoutes = express.Router();
const checkRole = require("../middlewares/authMiddleware");
const manager = require("../constant/constant").manager;

articleRoutes
  .route("/")
  .get(getAllArticles)
  .post(checkRole(manager), addArticle);

articleRoutes
  .route("/:id")
  .get(getArticleById)
  .put(checkRole(manager), updateArticle)
  .delete(checkRole(manager), deleteArticle);

module.exports = articleRoutes;
