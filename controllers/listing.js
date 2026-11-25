const Listing=require("../models/listing");
const cloudinary = require("../utils/cloudinary.js");
const streamifier = require("streamifier");


module.exports.index=async(req, res) => {
   const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
   const country = typeof req.query.country === "string" ? req.query.country.trim() : "";
   const minPriceValue = typeof req.query.minPrice === "string" ? req.query.minPrice : "";
   const maxPriceValue = typeof req.query.maxPrice === "string" ? req.query.maxPrice : "";
   const parsePrice = (value) => {
     if (value === "") return null;
     if (!/^\d+(\.\d{1,2})?$/.test(value)) return Number.NaN;
     const price = Number(value);
     return Number.isFinite(price) ? price : Number.NaN;
   };
   const minPrice = parsePrice(minPriceValue);
   const maxPrice = parsePrice(maxPriceValue);

   if (search.length > 100 || country.length > 80) {
     return res.status(400).render("error.ejs", { message: "Search filters are too long." });
   }
   if (Number.isNaN(minPrice) || Number.isNaN(maxPrice) || (minPrice !== null && maxPrice !== null && minPrice > maxPrice)) {
     return res.status(400).render("error.ejs", { message: "Enter a valid minimum and maximum price." });
   }

   const filter = {};
   if (search) {
     const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
     const searchRegex = new RegExp(escapedSearch, "i");
     filter.$or = [
       { title: searchRegex },
       { location: searchRegex },
       { country: searchRegex },
       { description: searchRegex },
     ];
   }
   if (country) filter.country = country;
   if (minPrice !== null || maxPrice !== null) {
     filter.price = {};
     if (minPrice !== null) filter.price.$gte = minPrice;
     if (maxPrice !== null) filter.price.$lte = maxPrice;
   }

   const [allListings, countries] = await Promise.all([
     Listing.find(filter).sort({ _id: -1 }),
     Listing.distinct("country", { country: { $type: "string", $ne: "" } }),
   ]);
   countries.sort((a, b) => a.localeCompare(b));

   res.render("listings/index.ejs", {
     allListings,
     countries,
     search,
     selectedCountry: country,
     minPrice: minPriceValue,
     maxPrice: maxPriceValue,
   });
 }
 
 module.exports.renderNewForm=async(req, res) => {
   res.render("listings/new.ejs");
 };


 module.exports.ShowListing=async(req, res) =>{
            let { id } = req.params;
        const listing = await Listing.findById(id)
        .populate("owner")
        .populate("reviews");
       res.render("listings/show.ejs",{listing});
    };

 module.exports .CreateNewForm=async (req, res) => {
     const newListing = new Listing(req.body.listing);
     const result = await new Promise((resolve, reject) => {
     const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "STAYSPACE" },
        (error, result) => {
            if (error) {
                reject(error);
            } 
            else {
                resolve(result);
            }
        }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});
newListing.image = {
    url: result.secure_url,
    filename: result.public_id,
};
      newListing.owner = req.user._id; 
      await newListing.save();
      req.flash("success","new listing added!");
      console.log(newListing);
      res.redirect("/listings");
    }


 module.exports .EditNewForm= async(req,res)=>{
  let { id } = req.params;
   const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
 };




module.exports .UpdateNewForm   =async(req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  // Update normal fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // Update image only when a new image is selected
    if (req.file) {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "STAYSPACE" },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            streamifier
                .createReadStream(req.file.buffer)
                .pipe(uploadStream);
        });

        listing.image = {
            url: result.secure_url,
            filename: result.public_id
        };
    }
   await listing.save();
   res.redirect(`/listings/${id}`);
}; 



module.exports .DestroyListing=  async (req, res) => {
 let { id } = req.params;
   const listing = await Listing.findById(id);

if (!listing.owner.equals(req.user._id)) {
    return res.redirect(`/listings/${id}`);
}
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
 };