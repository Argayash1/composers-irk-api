import { Router } from "express"; // импортируем роутер из express

import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleData,
  deleteArticleById,
  deleteMultipleArticlesByIds
} from "../controllers/articles";

import {
  articleDataValidator,
  articleQueryParamsValidator,
  articleIdValidator,
} from "../middlwares/validators/articleValidator";

const router = Router();

router.get("/", articleQueryParamsValidator, getArticles);

router.post("/", articleDataValidator, createArticle);

router.delete('/', deleteMultipleArticlesByIds)

router.get("/:articleId", articleIdValidator, getArticleById);

router.patch("/:articleId", articleIdValidator, articleDataValidator, updateArticleData);

router.delete("/:articleId", articleIdValidator, deleteArticleById);

export default router;
