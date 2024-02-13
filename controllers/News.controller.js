import vine, { errors } from "@vinejs/vine";
import fs from "fs";
import prisma from "../config/db.config.js";
import { newsSchema } from "../validations/newsValidation.js";
import { imageValidate, newUUID } from "../utils/image.util.js";

export async function viewAllNews(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    //Correct if provided wrong page number
    if (page <= 0) {
      page = 1;
    }

    //Correct if provided wrong limit to reduce overload on server
    if (limit <= 0 || limit > 100) {
      limit = 10;
    }
    const skip = (page - 1) * limit;

    const news = await prisma.news.findMany({
      take: limit,
      skip: skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

    const totalNewsCount = await prisma.news.count();
    const totalPages = Math.ceil(totalNewsCount / limit);

    if (!news) {
      return res.status(400).json({
        status: 400,
        message: "News not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      news: news,
      metaData: {
        totalPages: totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    });
  } catch (error) {
    console.log("Error occured : ", error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

export async function viewNewsByUser(req, res) {
  try {
    const user = req.user;
    const news = await prisma.news.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

    if (!news) {
      return res.status(400).json({
        status: 400,
        message: "News not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      news: news,
    });
  } catch (error) {
    console.log("Error occured : ", error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

export async function viewNewsById(req, res) {
  try {
    const { id } = req.params;
    const news = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

    if (!news) {
      return res.status(400).json({
        status: 400,
        message: "News not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      news: news,
    });
  } catch (error) {
    console.log("Error occured : ", error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

export async function addNews(req, res) {
  try {
    const user = req.user;
    const validator = vine.compile(newsSchema);
    const payload = await validator.validate(req.body);

    const image = req.files?.image;
    if (image) {
      const message = imageValidate(image?.size, image?.mimetype);
      if (message !== "OK") {
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }
      const imageName = newUUID() + "." + image?.name.split(".")[1];
      const uploadPath = process.cwd() + "/public/images/" + imageName;
      payload.image = imageName;

      image.mv(uploadPath, (err) => {
        if (err) throw err;
      });
    }

    payload.user_id = user.id;
    const news = await prisma.news.create({
      data: payload,
    });

    return res.json({
      status: 200,
      message: "News created successfully!",
      news,
    });
  } catch (error) {
    console.log("Error occured : ", error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

export async function updateNews(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    const news = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!news) {
      return res.status(400).json({ status: 400, message: "News not found." });
    }

    if (news.user_id !== user.id) {
      return res
        .status(400)
        .json({ status: 400, message: "You are not authorized." });
    }

    const validator = vine.compile(newsSchema);
    const payload = await validator.validate(req.body);
    const image = req.files?.image;
    if (image) {
      const message = imageValidate(image?.size, image?.mimetype);
      if (message !== "OK") {
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }
      const imageName = newUUID() + "." + image?.name.split(".")[1];
      const uploadPath = process.cwd() + "/public/images/" + imageName;

      image.mv(uploadPath, (err) => {
        if (err) throw err;
      });
      //Link new image in payload
      payload.image = imageName;

      //Delete old image from server
      if (fs.existsSync(process.cwd() + "/public/images/" + news.image)) {
        fs.unlinkSync(process.cwd() + "/public/images/" + news.image);
      }
    }

    await prisma.news.update({
      where: {
        id: Number(id),
      },
      data: payload,
    });
    res.status(200).json({
      status: 200,
      message: "News updated successfully!",
    });
  } catch (error) {
    console.log("Error occured : ", error);
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({
        errors: error.messages,
      });
    }
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

export async function deleteNews(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    const news = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!news) {
      return res.status(400).json({ status: 400, message: "News not found." });
    }
    if (user.id !== news?.user_id) {
      return res.status(401).json({ message: "Un Authorized" });
    }

    //Delete image from server
    if (fs.existsSync(process.cwd() + "/public/images/" + news.image)) {
      fs.unlinkSync(process.cwd() + "/public/images/" + news.image);
    }
    await prisma.news.delete({
      where: {
        id: Number(id),
      },
    });
    return res.json({ message: "News deleted successfully!" });
  } catch (error) {
    console.log("Error occured : ", error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}
