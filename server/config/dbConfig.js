const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL,{
    dbName: 'spmdb',
    
})

const connection = mongoose.connection;

connection.on("connected", () => {
    console.log("MongoDB is connected");
});

connection.on("error", () => {
    console.log("Error in MongoDB connection",error);
});

module.exports = mongoose;