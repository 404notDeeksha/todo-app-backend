const express = require("express");
require("dotenv").config();
const cors = require("cors");
const router = require("./routes/index.routes");
const cookieParser = require("cookie-parser");
const env = require("./config/envValidator");

const app = express();

const allowedOrigins = [env.DEV_FRONTEND_URL, env.DEP_FRONTEND_URL];

const isVercelPreview = (origin) =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin || "");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      console.log(
        "CORS policy: No origin provided (likely a non-browser request)"
      );
    } else {
      console.log("CORS policy: Origin provided:", origin);
    }
    if (!origin || allowedOrigins.includes(origin) || isVercelPreview(origin)) {
      console.log(
        "CORS policy: Allowing origin:",
        origin,
        allowedOrigins.includes(origin),
        isVercelPreview(origin)
      );
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.get("/api/test", (req, res) => {
  console.log("🔵 /api/test route hit!");
  res.json({ message: "API is working!" });
});

app.use("/", router);

module.exports = app;
