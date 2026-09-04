const mongoose = require("mongoose");

// connects to the database
async function connectDB() {
  try {
    let uri = process.env.MONGO_URI;
    if (!uri) {
      uri = "mongodb://127.0.0.1:27017/fca_refugee_support";
    }

    const conn = await mongoose.connect(uri);
    console.log(
      "MongoDB connected: " + conn.connection.host + "/" + conn.connection.name,
    );
  } catch (error) {
    console.log("Failed to connect to MongoDB");
    console.log(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
