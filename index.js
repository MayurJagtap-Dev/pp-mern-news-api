import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({
    message: "Sample get route working fine.",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});