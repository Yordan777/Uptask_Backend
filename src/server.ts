import dotenv from "dotenv";
import express  from "express";
import cors from "cors"
import { connectDB } from "./config/db";
import authRouter from "./routers/authRouter";
import projectrouter from "./routers/projectRouter";
import { corsConfig } from "./config/cors";


// conection to DB 
dotenv.config()
connectDB()


//server conection
const app = express()
app.use(cors(corsConfig))

//enviar datos a mongoose
app.use(express.json())
//Routers
app.use('/api/auth',authRouter)
app.use('/api/projects',projectrouter)

export default app