const express   = require("express"),
  services      = require("./services"),
  path          = require("path"),
  ncp           = require("ncp").ncp,
  fs            = require("fs");


const router = express.Router();

/**
 * Main page
 */
router.get("/", (req, res) => {
    res.render("index", { title: "Sideral JS - My HUB" });
});

/**
 * List all games list
 */
router.get("/hub/games", (req, res) => {
    try {
        const dir = path.join(__dirname, "../../../public/games");

        fs.exists(dir, (exist) => {
            if (!exist) {
                fs.mkdirSync(dir);
            }

            fs.readdir(path.join(__dirname, "../../../public/games"), (err, files) => {
                if (files) {
                    res.json({
                        games: files
                    });
                }
            });
        });

    } catch (e) {
        throw new Error(e);
    }
});

/**
 * Create a new game folder
 */
router.post("/hub/create", (req, res) => {
    const name      = req.body.name,
        nextPath    = path.join(__dirname, `../../../public/games/${name}`);

    ncp(path.join(__dirname, "../../default_game"), nextPath, (err) => {
        if (!err) {
            services.addWebpackEntry(name);
        }
        res.redirect("/hub/games");
    });
});


module.exports = router;
