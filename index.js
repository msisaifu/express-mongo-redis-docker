const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const { createClient } = require("redis");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_PORT,
  REDIS_USER,
} = require("./config/config");

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
let redisClient = createClient({
  legacyMode: true,
  url: `redis://${REDIS_USER}:${REDIS_PORT}`,
});

const app = express();
const postRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");
const port = process.env.PORT || 3000;

(async () => {
  try {
    await redisClient.connect();
    console.log("connect redis sucessfully");
  } catch (e) {
    console.log("something wrong with redis connection", e);
  }
})();

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect mongodb sucessfully");
  })
  .catch((e) => {
    console.log("something wrong with mongodb connection", e);
  });

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      saveUninitialized: false,
      resave: false,
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60,
    },
  })
);

app.enable("trust proxy");
app.use(express.json());
app.use(cors());

app.get("/api/v1", (req, res) => res.json(`app_running`));

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", authRouter);

app.listen(port, () => console.log(`app is running on port ${port}`));
