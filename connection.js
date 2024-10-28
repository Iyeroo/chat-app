const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://gauranisha053:22104094@cluster0.ccsmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = {connectDB}