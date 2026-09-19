require("dotenv").config();
const mongoose=require("mongoose");
const initData=require("./data.js")
const Listing = require("../models/listing.js");

const MONGO_URL =  process.env.ATLASDB_URL;;


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
    owner: "6aa460e828e4a11946e5bcf9"
}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
  
}


main()
    .then(async () => {
        await initDB();
        await mongoose.connection.close();
        console.log("database connection closed");
    })
    .catch((err) => {
        console.log(err);
    });
// Once the data is inserted, it stays in MongoDB.
// Your normal app.js doesn't need to import data.js to retrieve those listings.~