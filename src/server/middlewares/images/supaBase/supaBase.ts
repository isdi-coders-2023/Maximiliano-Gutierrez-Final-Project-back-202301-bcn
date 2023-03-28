import "../../../../loadEnvironment.js";
import { createClient } from "@supabase/supabase-js";
import { type CustomRequest } from "../../../../types/types.js";
import { type Response, type NextFunction } from "express";
import fs from "fs/promises";
import path from "path";

export const supabase = createClient(
  "https://uwlssmfekrxedciweqvk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bHNzbWZla3J4ZWRjaXdlcXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4NzQzMzgsImV4cCI6MTk5NDQ1MDMzOH0.2oiNbAP8h351KgYP6uKHzRAqU7ozfFwS3M1GSZEaZ0w"
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
