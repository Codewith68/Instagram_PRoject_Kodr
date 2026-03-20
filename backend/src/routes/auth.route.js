import { Router } from "express";
import passport from "passport";
import { googleCallback, login, register } from "../controllers/auth.controller.js";
import { loginvalidator, registervaliator } from "../validators/auth.validator.js";
import upload from "../config/multer.config.js";

const authRouter = Router();


authRouter.post("/register",upload.single("profilePic"),registervaliator, register);
authRouter.post("/login",loginvalidator,login);





// GET /api/auth/google
authRouter.get("/google",
  passport.authenticate("google", {
    scope: [ "profile", "email" ],
  })
)


authRouter.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback
)

authRouter.post("/logout", () => {});

export default authRouter;
