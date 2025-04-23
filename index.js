import express from "express";

const app = express();

const port = 4000;

app.use(express.static("public"));

app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port);
  });