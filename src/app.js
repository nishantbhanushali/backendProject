import express from "express"
import cookieParser from "cookie-parser"
import cors from"cors"

let app = express()

app.use(express.json(limit="150kb"))
app.use(express.urlencoded({extended:true, limit:"16kb"}))

app.use(cookieParser())

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))



export default app