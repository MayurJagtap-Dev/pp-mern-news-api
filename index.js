import express from "express";
import cors from "cors";
import "dotenv/config";
import api_route from "./routes/route.js";
import fileupload from "express-fileupload";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(fileupload());
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({
    message: "Sample get route working fine.",
  });
});

app.use("/api", api_route);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
