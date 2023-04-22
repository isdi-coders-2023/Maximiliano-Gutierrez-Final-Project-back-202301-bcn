import { Joi } from "express-validation";

const registerUserSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export default registerUserSchema;
