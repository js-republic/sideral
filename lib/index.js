"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Element = require("./Element");

var _Element2 = _interopRequireDefault(_Element);

var _Engine = require("./Engine");

var _Engine2 = _interopRequireDefault(_Engine);

var _Entity = require("./Entity");

var _Entity2 = _interopRequireDefault(_Entity);

var _Scene = require("./Scene");

var _Scene2 = _interopRequireDefault(_Scene);

var _Component = require("./Component");

var _Component2 = _interopRequireDefault(_Component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sideral = {
    Element: _Element2.default,
    Engine: _Engine2.default,
    Entity: _Entity2.default,
    Scene: _Scene2.default,
    Component: _Component2.default
};

exports.default = Sideral;

/*

export default Entity("space", {
    x: 10,
    y: 10
})

 */