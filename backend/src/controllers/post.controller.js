import PostModel from "../models/post.model.js";
import { uploadFile } from "../services/storage.service.js";

function getMediaType(mimetype = "") {
  if (mimetype.startsWith("video/")) {
    return "video";
  }

  return "image";
}

export async function createPost(req, res) {
  try {
    const userId = req.user?.id || req.body.user;
    const { caption = "" } = req.body;
    const files = req.files || [];

    if (!userId) {
      return res.status(400).json({
        message: "User id is required",
      });
    }

    if (!files.length) {
      return res.status(400).json({
        message: "Please upload at least one media file",
      });
    }

    const uploadedMedia = [];

    for (const file of files) {
      const result = await uploadFile(
        file.buffer,
        file.originalname,
        "/posts",
      );

      uploadedMedia.push({
        url: result.url,
        mediaType: getMediaType(file.mimetype),
      });
    }

    const post = await PostModel.create({
      caption,
      media: uploadedMedia,
      user: userId,
    });

    return res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Something went wrong while creating post",
    });
  }
}
