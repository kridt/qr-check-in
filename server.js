const express = require("express");
const app = express();
const port = 6969;

app.get("/api/start", (req, res) => {
  console.log("start");

  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
