import vine from "@vinejs/vine";
import { customErrorReporter } from "../validations/customErrorReporter.js";

//vine.errorReporter = customErrorReporter;
vine.errorReporter = () => new customErrorReporter();

export const registerSchema = vine.object({
  name: vine.string().minLength(4).maxLength(30).required(),
  email: vine.string().email().required(),
  password: vine
    .string()
    .minLength(8)
    .maxLength(30)
    .confirmed({ confirmationField: "confirmPassword" })
    .required(),
});

export const loginSchema = vine.object({
  email: vine.string().email().required(),
  password: vine.string().minLength(8).maxLength(30).required(),
});
