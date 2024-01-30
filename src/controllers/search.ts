// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт модели news и её интерфейса
import Article from '../models/article';
import Audio from '../models/audio';
import History from '../models/history';
import Member from '../models/member';
import News from '../models/news';
import Project from '../models/project';
import Report from '../models/report';
import Score from '../models/score';
import Video from '../models/video';

const getSearchResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await Article.find({});
    const audios = await Audio.find({});
    const ourHistory = await History.find({});
    const members = await Member.find({});
    const news = await News.find({});
    const projects = await Project.find({});
    const reports = await Report.find({});
    const scores = await Score.find({});
    const videos = await Video.find({});

    const combinedArray = [
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

    res.send(combinedArray);
  } catch (err) {
    next(err);
  }
};

export { getSearchResults };
