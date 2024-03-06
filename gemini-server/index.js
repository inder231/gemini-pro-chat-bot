const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { rateLimit } = require("express-rate-limit");
const PORT = process.env.PORT || 8080;

// Trust the proxy
app.set('trust proxy', true);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    message: "You have exceeded the per minute request limit (5req/min)",
  },
  // store: ... , // Redis, Memcached, etc. See below.
});

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(limiter);

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_GEN_AI_KEY);

app.post("/gemini", async (req, res) => {
  try {
    const { history, message } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(message);

    const response = await result.response;

    const text = response.text();

    res.status(200).json({ message: text });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
