import express from "express"
import morgan from "morgan"
import cookieparser from "cookie-parser"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth.route.js"
import postRouter from "./routes/post.route.js"


const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieparser())
app.use(passport.initialize());


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);


app.use("/api/auth",authRouter)
app.use("/api/posts",postRouter)
export default app