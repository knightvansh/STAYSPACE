require("dotenv").config({ path: "../.env" });
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
// If your database ever gets cluttered with spam from people testing your website, all you have to do is open your terminal and run node init/index.js.
// wipes out all the junk listings and restores your database to the beautiful, pristine state with your original 30 propertie

  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6ab2a2642fc0ebca51fcc878"
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