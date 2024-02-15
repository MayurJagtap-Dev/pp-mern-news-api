import prisma from "../config/db.config.js";
import logger from "../config/logger.config.js";
import { imageValidate, newUUID } from "../utils/image.util.js";

export async function viewUser(req, res) {
  try {
    const user = req.user;
    return res.json({ status: 200, user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Profile image is required." });
    }

    const profile = req.files.profile;
    const message = imageValidate(profile?.size, profile.mimetype);
    if (message !== "OK") {
      return res.status(400).json({
        errors: {
          profileImage: message,
        },
      });
    }

    const imageName = newUUID() + "." + profile?.name.split(".")[1];
    const uploadPath = process.cwd() + "/public/images/" + imageName;

    profile.mv(uploadPath, (err) => {
      if (err) throw err;
    });

    await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        profile: imageName,
      },
    });

    return res.json({
      status: 200,
      message: "Profile updated successfully!",
    });
    logger.info("Profile updated successfully!");
  } catch (error) {
    console.log("Error occured : ", error);
    logger.error(error?.message);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again!!" });
  }
}
