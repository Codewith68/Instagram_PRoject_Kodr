import express from "express"
import morgan from "morgan"
import authRouter from "./routes/auth.route.js"
import postRouter from "./routes/post.route.js"


const app = express()
app.use(express.json())
app.use(morgan("dev"))

app.use("/api/auth",authRouter)
app.use("/api/posts",postRouter)
export default app