import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import utils from "../utils/utils";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body && req.body.userInfo) {
      const user = req.body.userInfo;
      const existingUser = await userModel.findOne({ sub: user.sub });

      if (existingUser) {
        res
          .status(200)
          .json(utils.getResponse(false, existingUser, "User already exists!"));
      } else {
        const userInfo = new userModel({ ...user });
        const result = await userInfo.save();

        if (result) {
          res
            .status(200)
            .json(
              utils.getResponse(false, result, "User data has been saved!")
            );
        } else {
          throw new Error("Error occurred while saving user data!");
        }
      }
    }
  } catch (ex: any) {
    next(ex);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json("signup api");
  } catch (ex: any) {
    next(ex);
  }
};


