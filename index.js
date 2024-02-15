import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import api_route from "./routes/route.js";
import fileupload from "express-fileupload";
import limiter from "./config/rateLimit.config.js";
import "./utils/queueIndex.js";
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());
app.use(helmet());
app.use(fileupload());
app.use(limiter);

app.get("/", (req, res) => {
  res.json({
    message: "Sample get route working fine.",
  });
});

app.use("/api", api_route);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
