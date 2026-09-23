const Listing=require("../models/listing");
const cloudinary = require("../utils/cloudinary.js");
const streamifier = require("streamifier");


module.exports.index=async(req, res) => {
  const allListings = await Listing.find({}).sort({ _id: -1 });
   console.log("TOTAL LISTINGS:", allListings.length);
   res.render("listings/index.ejs", { allListings });
 }
 
 module.exports.renderNewForm=async(req, res) => {
   res.render("listings/new.ejs");
 };


 module.exports.ShowListing=async(req, res) =>{
            let { id } = req.params;
        const listing = await Listing.findById(id)
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
            } else {
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