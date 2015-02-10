// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
})();

var myApp = angular.module('app', []);
