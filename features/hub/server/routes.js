const express   = require("express"),
    services    = require("./services"),
    path        = require("path"),
    ncp         = require("ncp").ncp,
    fs          = require("fs");


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
router.get("/hub/projects", (req, res) => {
    try {
        const dir = path.join(__dirname, "../../../public/projects");

        fs.exists(dir, (exist) => {
            if (!exist) {
                fs.mkdirSync(dir);
            }

            fs.readdir(path.join(__dirname, "../../../public/projects"), (err, files) => {
                if (files) {
                    res.json({
                        projects: files
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
        nextPath    = path.join(__dirname, `../../../public/projects/${name}`);

    ncp(path.join(__dirname, "../../default_project"), nextPath, (err) => {
        if (!err) {
            services.addWebpackEntry(name);
        }
        res.redirect("/hub/project");
    });
});


module.exports = router;
