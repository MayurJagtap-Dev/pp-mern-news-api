import prisma from "../config/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../config/logger.config.js";
import { sendMail } from "../config/mailer.js";
import { emailQueue, emailQueueName } from "../utils/sendMail.util.js";

export async function register(req, res) {
  try {
    const validator = vine.compile(registerSchema);
    const payload = await validator.validate(req.body);

    const findUser = await prisma.users.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (findUser) {
      return res.status(400).json({
        message: "Email already registered, try using another.",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    payload.password = bcrypt.hashSync(payload.password, salt);

    const user = await prisma.users.create({
      data: payload,
    });

    await sendMail(
      payload.email,
      "Welcome to News API",
      "<h1>Welcome to News API, You can now access all the latest news updates.</h1>"
    );
    return res.json({
      status: 200,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log("Error occured : ", err);
    logger.error(error?.message);
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({
        errors: error.messages,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Something went wrong, please try again.",
      });
    }
  }
}

export async function login(req, res) {
  try {
    const validator = vine.compile(loginSchema);
    const payload = await validator.validate(req.body);

    const findUser = await prisma.users.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (findUser) {
      if (!bcrypt.compareSync(payload.password, findUser.password)) {
        return res.status(400).json({
          errors: {
            email: "Invalid Credentials.",
          },
        });
      }

      // Issue token to user
      const payloadData = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        profile: findUser.profile,
      };

      const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });

      return res.json({
        message: "User logged in successfully.",
        access_token: `Bearer ${token}`,
      });
    }

    return res.status(400).json({
      errors: {
        email: "Email not registered.",
      },
    });
  } catch (error) {
    console.log("Error occured : ", error);
    logger.error(error?.message);
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ errors: error.messages });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Something went wrong, please try again.",
      });
    }
  }
}

export async function sendMails(req, res) {
  try {
    const { subject, content } = req.body;

    const users = await prisma.users.findMany();
    const payload = users.map((user) => {
      return {
        toMail: user.email,
        subject: subject,
        body: content,
      };
    });

    await emailQueue.add(emailQueueName, payload);

    return res.json({
      status: 200,
      message: "Newsletters scheduled successfully",
    });
  } catch (error) {
    logger.error("Failed to send mails");
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
}
