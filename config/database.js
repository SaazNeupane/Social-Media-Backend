const mongoose = require("mongoose");

const connectDatabase = async () => {
  mongoose
    .connect(process.env.DB_LOCAL_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`MongoDB connected with HOST: ${con.connection.host}`);
    });
};

module.exports = connectDatabase;
