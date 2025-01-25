import express, { Request, Response } from "express";
import bookRoutes from "./routes/bookRoutes"

import cors from "cors";



const app = express()
const PORT = process.env.PORT || 8000
app.use(cors())
app.use(express.json())
app.use("/api", bookRoutes)

app.get('/', (req, res) => {
    res.send("Welcome to Node js + Typescript")
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
