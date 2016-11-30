const fs = require("fs"),
    path = require("path");

const services = module.export = {};

services.addWebpackEntry = (name) => {
    const entriesPath   = path.join(__dirname, "../../../config/webpack.entries.json"),
        entries         = JSON.parse(fs.readFileSync(entriesPath));

    entries[`games/${name}/sideral`] = `./public/games/${name}/src`;
    fs.writeFileSync(entriesPath, JSON.stringify(entries));
};

module.exports = services;