import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

let app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())


app.use(cors({
    origin: process.env.CORS_ORIGIN
}))



// import routes
import { router } from "./routes/user.routes.js"

// routes declaration

app.use("/api/v1/users", router)


export default app