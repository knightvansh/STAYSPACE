const mongoose=require("mongoose");
const initData=require("./data.js")
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a9be30625cdce81d7788e53"
}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
  
}

initDB();
// Once the data is inserted, it stays in MongoDB.
// Your normal app.js doesn't need to import data.js to retrieve those listings.~