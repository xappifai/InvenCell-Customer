import mongoose from "mongoose";
const mongoURL = process.env.mongoDB;
const connection = () => {
  mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
};

export default connection;
