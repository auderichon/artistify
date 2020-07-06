const express = require("express");
const router = new express.Router();
const labelModel = require("../models/Label");

// *********************************************
// ALL THESE ROUTES ARE PREFIXED WITH "/labels"
// *********************************************

// PRIVATE ROUTES

router.get("/admin", (req, res, next) => {
  labelModel
    .find() // retrieve all the documents in the labels collection
    .then(dbResults =>
      res.render("tables/labels", {
        labels: dbResults
      })
    )
    .catch(next);
});

router.get("/create", (req, res) => {
  res.render("forms/label");
});

router.post("/create", (req, res) => {
  const newLabel = req.body;
  if (req.body.logo === "") newLabel.logo = undefined;

  labelModel.create(newLabel)
    .then(() => res.redirect("/labels/admin"))
    .catch((dbErr) => res.send(JSON.stringify(dbErr)));
});

router.get("/delete/:id", (req, res, next) => {
  labelModel
  .findByIdAndDelete(req.params.id)
  .then(dbRes => {
    req.flash("success", "label successfully deleted");
    res.redirect("/labels/admin");
  })
  .catch(next);
});

router.get("/update/:id", async (req, res) => {
  const label = await labelModel.findById(req.params.id);
  res.render("forms/label-update.hbs", label);
});

router.post("/update/:id", async (req, res) => {
  try {
    await labelModel.findByIdAndUpdate(
      req.params.id,
      req.body,
    );

    res.redirect("/labels/admin");
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
