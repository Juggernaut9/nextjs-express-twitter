import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Post from "../models/Post";

export const getProfileById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userPosts = await Post.find({ creator: req.params.id })
      .populate("likes")
      .populate("creator")
      .populate({
        path: "comments",
        populate: {
          path: "creator",
        },
      });

    const user = await User.findById(req.params.id).lean();

    const userPostsWithLikes = userPosts.map((post) => {
      return { ...post.toObject(), likeCount: post.likes.length };
    });
    res.send({ ...user, posts: userPostsWithLikes });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};
