import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());

console.log(process.env.HOST);

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/login.html")); 
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});