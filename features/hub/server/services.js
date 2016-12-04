const fs = require("fs"),
    path = require("path");

const services = module.export = {};

services.addWebpackEntry = (name) => {
    const entriesPath   = path.join(__dirname, "../../../config/webpack.entries.json"),
        entries         = JSON.parse(fs.readFileSync(entriesPath));

    entries[`projects/${name}/sideral`] = `./public/projects/${name}/src`;
    fs.writeFileSync(entriesPath, JSON.stringify(entries));
};

services.setWebpackEntries = (names) => {
    const entriesPath   = path.join(__dirname, "../../../config/webpack.entries.json"),
        entries         = JSON.parse(fs.readFileSync(entriesPath));

    for (const key in entries) {
        if (entries.hasOwnProperty(key) && key.indexOf("projects/") > -1) {
            let exist = false;

            names.forEach((name) => {
                if (key.indexOf(name) > -1) {
                    exist = true;
                }
            });

            if (!exist) {
                delete entries[key];
            }
        }
    }

    names.forEach((name) => {
        entries[`projects/${name}/sideral`] = `./public/projects/${name}/src`;
    });

    fs.writeFileSync(entriesPath, JSON.stringify(entries));
};

module.exports = services;