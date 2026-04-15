const Listing = require('../models/listing.js');
const ExpressError = require('../utils/expressError.js');

module.exports.index = async (req, res) => {
  const lists = await Listing.find({});
  res.render("listings/index.ejs", { lists });
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "owner" } })
    .populate("owner");

  if (!list) {
    req.flash("error", "Listing does not found !");
    return res.redirect("/listing");
  }

  const lat = list.map.coordinates[1];
  const lng = list.map.coordinates[0];

  res.render("listings/show.ejs", {
    list,
    apiKey: process.env.GEOAPIFY_API_KEY,
    lat,
    lng
  });
};

module.exports.newListing = async (req, res) => {
  let data = req.body.listing;

  // Geocoding API call
  const query = encodeURIComponent(`${data.location}, ${data.country}`);
  const geoRes = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${process.env.GEOAPIFY_API_KEY}`
  );
  const geoData = await geoRes.json();

  let newList = new Listing(data);
  newList.owner = req.user._id;
  newList.image.url = req.file.path;
  newList.image.filename = req.file.filename;


  if (geoData.features && geoData.features.length > 0) {
    newList.map = geoData.features[0].geometry;
    //{ type: "Point", coordinates: [lng, lat] }
  }

  await newList.save();
  req.flash("success", "New Listing Added !");
  res.redirect("/listing");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listing");
  }
  res.render("listings/edit.ejs", { list });
}

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    req.flash("error", "Listing not exist !");
    return res.redirect("/listing");
  }

  let updatedData = req.body.listing;


  console.log(req.file);

  if (req.file) {
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  // Geocoding
  try {
    const query = encodeURIComponent(`${updatedData.location}, ${updatedData.country}`);
    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${process.env.GEOAPIFY_API_KEY}`
    );
    const geoData = await geoRes.json();
    if (geoData.features && geoData.features.length > 0) {
      updatedData.map = geoData.features[0].geometry;
    }
  } catch (err) {
    console.log("Geocoding failed:", err.message);
  }

  let list = await Listing.findByIdAndUpdate(id, updatedData, {
    runValidators: true,
    returnDocument: 'after'
  });

  if (!list) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listing");
  }

  req.flash("success", "Listing Edited !");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let deleteList = await Listing.findByIdAndDelete(id);
  if (deleteList) {
    req.flash("success", "Listing Deleted !");
  }
  console.log(deleteList);
  res.redirect("/listing");
}