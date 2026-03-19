import { Router } from "express";
import upload from "../config/multer.config.js";
import { createPost } from "../controllers/post.controller.js";


const postRouter = Router();


postRouter.post("/create", upload.array("media"), createPost);

export default postRouter;
