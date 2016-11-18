"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {

  /* LIFECYCLE */
  function Element() {
    _classCallCheck(this, Element);

    /**
     * Unique id of element
     * @type {string}
     */
    this.id = Element.generateId();

    /**
     * Parent element
     * @type {Element}
     */
    this.parent = null;

    /**
     * Elements children
     * @type {Array<Element>}
     */
    this.children = [];

    /**
     * Know if this component is detroyed or not
     * @type {boolean}
     * @private
     */
    this.destroyed = false;
  }

  /**
   * Initialization of the element after it is created into the engine
   * @returns {void}
   */


  _createClass(Element, [{
    key: "initialize",
    value: function initialize() {}

    /* METHODS */

    /**
     * Generate an unique id
     * @returns {string} return the unique id
     */

  }], [{
    key: "generateId",
    value: function generateId() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
  }]);

  return Element;
}();

exports.default = Element;