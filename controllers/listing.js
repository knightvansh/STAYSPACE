const Listing=require("../models/listing");

module.exports.index=async(req, res) => {
  const allListings = await Listing.find({});
   console.log("TOTAL LISTINGS:", allListings.length);
   res.render("listings/index.ejs", { allListings });
 }
 
 module.exports.renderNewForm=async(req, res) => {
   res.render("listings/new.ejs");
 };


 module.exports.ShowListing=async(req, res) =>{
            let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
       res.render("listings/show.ejs",{listing});
    };

 module.exports .CreateNewForm=async (req, res) => {
          const newListing = new Listing(req.body.listing);
           newListing.image = {
          url: "/uploads/" + req.file.filename,
          filename: req.file.filename,
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
   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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