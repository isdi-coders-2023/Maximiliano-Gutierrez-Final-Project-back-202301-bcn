import "../../../../loadEnvironment.js";
import { createClient } from "@supabase/supabase-js";
import { type CustomRequest } from "../../../../types/types.js";
import { type Response, type NextFunction } from "express";
import fs from "fs/promises";
import path from "path";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!
);

const supaBase = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageName = req.file?.filename;

    const imagePath = path.join("uploads", imageName!);

    const image = await fs.readFile(imagePath);

    await supabase.storage.from("images").upload(imageName!, image);

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(imageName!);

    req.body.image = publicUrl;
    req.body.backupImage = imagePath;

    next();
  } catch (error) {
    const customError = new Error("Failed to upload image");

    next(customError);
  }
};

export default supaBase;
