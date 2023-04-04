import {
  supabaseId,
  supabaseKey,
  supabaseUrl,
} from "../../../../loadEnvironment.js";
import { createClient } from "@supabase/supabase-js";
import { type CustomRequest } from "../../../../types/types.js";
import { type Response, type NextFunction } from "express";
import fs from "fs/promises";
import path from "path";

export const supabase = createClient(supabaseUrl!, supabaseKey!);

const supaBase = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageName = req.file?.filename;

    const imagePath = path.join("uploads", imageName!);

    const image = await fs.readFile(imagePath);

    await supabase.storage.from(supabaseId!).upload(imageName!, image);

    const {
      data: { publicUrl },
    } = supabase.storage.from(supabaseId!).getPublicUrl(imageName!);

    req.body.image = imagePath;
    req.body.backupImage = publicUrl;

    next();
  } catch (error) {
    const customError = new Error("Failed to upload image");

    next(customError);
  }
};

export default supaBase;
