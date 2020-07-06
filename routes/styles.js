const express = require("express");
const router = new express.Router();
const styleModel = require("./../models/Style");

// *********************************************
// ALL THESE ROUTES ARE PREFIXED WITH "/styles"
// *********************************************

// handle and render the initial view
router.get("/admin", (req, res, next) => {
  styleModel
    .find() // retrieve all the documents in the styles collection
    .then(dbResults =>
      res.render("tables/styles", {
        styles: dbResults
      })
    )
    .catch(next);
});

router.get("/create", (req, res) => {
  res.render("forms/style");
});

router.post("/create", (req, res) => {
  styleModel.create(req.body)
    .then(() => res.redirect("/styles/admin"))
    .catch((dbErr) => res.send(JSON.stringify(dbErr)));
});

router.get("/delete/:id", (req, res, next) => {
  styleModel
  .findByIdAndDelete(req.params.id)
  .then(dbRes => {
    req.flash("success", "style successfully deleted");
    res.redirect("/styles/admin");
  })
  .catch(next);
});

router.get("/update/:id", async (req, res) => {
  const style = await styleModel.findById(req.params.id);
  res.render("forms/style-update.hbs", style);
});

router.post("/update/:id", async (req, res) => {
  try {
    await styleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
    );

    res.redirect("/styles/admin");
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
