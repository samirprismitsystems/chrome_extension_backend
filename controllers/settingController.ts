import { NextFunction, Request, Response } from "express";
import settingModel from "../models/settingModel";
import { ISettingInfo } from "../types/common";
import utils from "../utils/utils";

export const getSettingList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const info = req.query;
    const result = await settingModel.find({ settingID: info.settingID });
    if (result) {
      res
        .status(200)
        .json(utils.getResponse(false, result, "Successfully get settings!"));
    } else {
      throw new Error("Error occurred while getting setting!");
    }
  } catch (ex: any) {
    next(ex);
  }
};

export const saveSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const info: ISettingInfo = req.body;
    const existingSetting = await settingModel.findOne({ settingID: info.settingID });

    if (existingSetting) {
      // If a record exists, update it
      const result = await settingModel.findOneAndUpdate({ settingID: info.settingID }, { $set: info }, { new: true });
      if (result) {
        res
          .status(200)
          .json(utils.getResponse(false, result, "Settings has been updated!"));
      } else {
        throw new Error("Error occurred while updating setting!");
      }
    } else {
      // If no record exists, create a new record
      const settingInfo = new settingModel({ ...info });
      const result = await settingInfo.save();
      if (result) {
        res
          .status(200)
          .json(utils.getResponse(false, result, "Settings has been saved!"));
      } else {
        throw new Error("Error occurred while saving setting!");
      }
    }
  } catch (ex: any) {
    next(ex);
  }
};

