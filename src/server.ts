import express from "express";
import authRoutes from "./routes/userRoute";
import postRoutes from "./routes/postRoutes"

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

// Route dasar untuk memastikan API berjalan
app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running successfully!" });
});

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
