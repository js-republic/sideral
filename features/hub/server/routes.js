const express = require("express");


const router = express.Router();


router.get("/", (req, res) => {
    res.render("index", { title: "Sideral JS - My HUB" });
});


module.exports = router;
