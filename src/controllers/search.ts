// Импорт типов из express
import { Request, Response, NextFunction } from "express";

// Импорт модели news и её интерфейса
import Article from "../models/article";
import Audio from "../models/audio";
import History from "../models/history";
import Member from "../models/member";
import News from "../models/news";
import Project from "../models/project";
import Report from "../models/report";
import Score from "../models/score";
import Video from "../models/video";
import BadRequestError from "../errors/BadRequestError";
import { BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE } from "../utils/constants";

const getSearchResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchQuery = req.query.q;
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit
      ? Number(req.query.limit as string)
      : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    let results = [];

    const searchPromises = [
      Article.find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { articleDescription: { $regex: searchQuery, $options: "i" } },
          { articleText: { $regex: searchQuery, $options: "i" } },
        ],
      }),

      Audio.find({
        $or: [
          { composer: { $regex: searchQuery, $options: "i" } },
          { title: { $regex: searchQuery, $options: "i" } },
          { performer: { $regex: searchQuery, $options: "i" } },
        ],
      }),

      History.find({
        $or: [
          { text: { $regex: searchQuery, $options: "i" } },
          { author: { $regex: searchQuery, $options: "i" } },
        ],
      }),

      Member.find({
        $or: [
          { surname: { $regex: searchQuery, $options: "i" } },
          { patronymic: { $regex: searchQuery, $options: "i" } },
          { name: { $regex: searchQuery, $options: "i" } },
          { profession: { $regex: searchQuery, $options: "i" } },
          { biography: { $regex: searchQuery, $options: "i" } },
          { shortBiography: { $regex: searchQuery, $options: "i" } },
          { works: { $regex: searchQuery, $options: "i" } },
          { competitions: { $regex: searchQuery, $options: "i" } },
          { awards: { $regex: searchQuery, $options: "i" } },
          { links: { $regex: searchQuery, $options: "i" } },
        ],
      }),

      News.find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { newsText: { $regex: searchQuery, $options: "i" } },
        ],
      }),

      Project.find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
        ],
      }),

      Report.find({
        $or: [{ year: { $regex: searchQuery, $options: "i" } }],
      }),

      Score.find({
        $or: [
          { composer: { $regex: searchQuery, $options: "i" } },
          { title: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
        ],
      }),

      Video.find({
        $or: [
          { composer: { $regex: searchQuery, $options: "i" } },
          { title: { $regex: searchQuery, $options: "i" } },
          { performer: { $regex: searchQuery, $options: "i" } },
          { about: { $regex: searchQuery, $options: "i" } },
        ],
      }),
    ];

    const [
      articles,
      audios,
      ourHistory,
      members,
      news,
      projects,
      reports,
      scores,
      videos,
    ] = await Promise.all(searchPromises);

    results = [
      ...articles,
      ...audios,
      ...ourHistory,
      ...members,
      ...news,
      ...projects,
      ...reports,
      ...scores,
      ...videos,
    ];

    let totalPages = 1;

    if (page && limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      totalPages = Math.ceil(results.length / limit);
      results = results.slice(startIndex, endIndex);
    }

    res.send({ results, totalPages });
  } catch (err) {
    next(err);
  }
};

export { getSearchResults };
