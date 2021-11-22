"use strict";
exports.__esModule = true;
exports.use = exports.version = void 0;
var bowser_scss_1 = require("./style/bowser.scss");
var utils_1 = require("./utils/utils");
var button_1 = require("./button");
var icon_1 = require("./icon");
var badge_1 = require("./badge");
var link_1 = require("./link");
var switch_1 = require("./switch");
var components = { Button: button_1.Button, Icon: icon_1.Icon, Badge: badge_1.Badge, Link: link_1.Link, Switch: switch_1.Switch };
exports.version = '1.0';
var use = function (props) {
    var _a, _b;
    if (props === void 0) { props = {}; }
    //Add global style
    if (document) {
        var stylee = document.createElement('style');
        stylee.innerHTML = bowser_scss_1["default"] ? bowser_scss_1["default"].toString() : '';
        (_b = (_a = document.getElementsByTagName('head')) === null || _a === void 0 ? void 0 : _a.item(0)) === null || _b === void 0 ? void 0 : _b.appendChild(stylee);
    }
    //Register component
    if (!props.components ||
        Object.getOwnPropertyNames(props.components).length == 0) {
        for (var key in components) {
            var name_1 = key.toLowerCase();
            utils_1.defindComponent(name_1, components[key]);
        }
    }
    else {
        var len = props.components.length || 0;
        for (var i = 0; i < len; i++) {
            var key = props.components[i];
            var name_2 = key.toLowerCase();
            utils_1.defindComponent(name_2, components[key]);
        }
    }
};
exports.use = use;
var Novel = {
    use: exports.use,
    version: exports.version
};
exports["default"] = Novel;
