const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

// 08 video 83
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

mongoose
  .connect(DB, clientOptions)
  .then(() => console.log("db connecton successful..."));

// 06 video 67-

// environment variable set by express
// console.log(app.get("env"));

// environment variable set by nodejs
// console.log(process.env)

const port = process.env.PORT || 3000;

//starts a server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// 09 video 122
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// related to hosting service: RENDER
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: Shutting down gracefully');
  // Close your server and other resources here
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
