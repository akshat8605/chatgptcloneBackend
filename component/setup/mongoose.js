const mongoose = require("mongoose");
const url = `mongodb+srv://${encodeURIComponent(process.env.Mongo_User)}:${encodeURIComponent(process.env.Mongo_Pass)}@cluster0.5je4b.mongodb.net/${process.env.Mongo_Database_Name}?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected!");
});