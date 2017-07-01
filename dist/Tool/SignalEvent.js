"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var signals = require("signals");
var SignalEvent = (function (_super) {
    __extends(SignalEvent, _super);
    /**
     * @constructor
     * @param {function=} onBindEvent - Event fired when there is a new bind into this signal
     * @param {function=} onRemoveEvent - Event fired when there is a remove into this signal
     */
    function SignalEvent(onBindEvent, onRemoveEvent) {
        var _this = _super.call(this) || this;
        _this.onBindEvent = onBindEvent;
        _this.onRemoveEvent = onRemoveEvent;
        _this.keysBound = [];
        return _this;
    }
    /**
     * @override
     */
    SignalEvent.prototype.add = function (listener, listenerContext, priority) {
        var signalBinding = _super.prototype.add.call(this, listener, listenerContext, priority);
        if (this.onBindEvent) {
            this.onBindEvent(listener, listenerContext, priority);
        }
        return signalBinding;
    };
    /**
     * @override
     */
    SignalEvent.prototype.addOnce = function (listener, listenerContext, priority) {
        var signalBinding = _super.prototype.addOnce.call(this, listener, listenerContext, priority);
        if (this.onBindEvent) {
            this.onBindEvent(listener, listenerContext, priority);
        }
        return signalBinding;
    };
    /**
     * @override
     */
    SignalEvent.prototype.remove = function (listener, context) {
        _super.prototype.remove.call(this, listener, context);
        if (this.onRemoveEvent) {
            this.onRemoveEvent(listener, context);
        }
        return listener;
    };
    /**
     * @override
     */
    SignalEvent.prototype.removeAll = function () {
        if (this.onRemoveEvent) {
            this.onRemoveEvent(null);
        }
        _super.prototype.removeAll.call(this);
    };
    /**
     * Bind a listener when signal dispatch a key
     * @param {string|Array<string>} key: key to bind the listener
     * @param {Function} listener: Signal handler function
     * @returns {*} An Object representing the binding between the Signal and listener
     */
    SignalEvent.prototype.bind = function (key, listener) {
        var keys = [].concat(key);
        this.keysBound.push(keys);
        return this.add(function addListener(listenerKey) {
            if (keys.find(function (currentKey) { return currentKey === listenerKey; })) {
                listener.apply(void 0, [].slice.call(arguments, 1));
            }
        });
    };
    /**
     * Dispatch all listener (even with listener linked to a key)
     * @returns {void}
     */
    SignalEvent.prototype.dispatchAll = function () {
        var _this = this;
        this.dispatch();
        this.keysBound.forEach(function (keys) { return _this.dispatch(keys[0]); });
    };
    Object.defineProperty(SignalEvent.prototype, "listenerLength", {
        get: function () {
            return this._bindings.length;
        },
        enumerable: true,
        configurable: true
    });
    return SignalEvent;
}(signals.Signal));
exports.SignalEvent = SignalEvent;
