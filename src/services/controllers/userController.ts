import { Request, Response } from "express";
import { FeedNews } from "../db/schema/news";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req?.query?.skip as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const startIndex = (page - 1) * limit;
    const total = await FeedNews.countDocuments();

    const news = await FeedNews.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ status: 200, news: news, total });
  } catch (error) {}
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
};
