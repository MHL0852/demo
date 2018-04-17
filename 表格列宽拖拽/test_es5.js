'use strict';

(function () {
    var initX = void 0,
        initEvent = void 0,
        containerWidth = void 0,
        width = void 0,
        endX = void 0;
    var headContent = document.getElementById('tabHeader').rows[0].cells;
    [].forEach.call(headContent, function (item) {
        var line = document.createElement('div');
        line.className = 'line';
        item.appendChild(line);
    });

    var downFn = function downFn(e) {
        e = e || window.event;

        if (e.target.className === 'line') {
            initX = e.clientX;
            width = getComputedStyle(e.target.parentNode).width;
            width = parseFloat(width);
            initEvent = e;
            window.addEventListener('mousemove', moveFn, false);
            containerWidth = parseFloat(getComputedStyle(e.target.parentNode.parentNode.parentNode.parentNode).width);
        }
    };
    var moveFn = function moveFn(e) {
        e = e || window.event;
        endX = e.clientX;
        if (initEvent) {
            if (Math.abs(endX - initX) >= 10) {
                initEvent.target.parentNode.width = width + endX - initX;
                if (initEvent.target.parentNode.clientWidth === 352 && endX - initX <= 0) {
                    return;
                }
                initEvent.target.parentNode.parentNode.parentNode.parentNode.style.width = containerWidth + endX - initX + 'px';
            }
            endX = null;
        }
    };

    var upFn = function upFn(e) {
        e = e || window.event;
        endX = e.clientX;
        if (initEvent) {
            if (Math.abs(endX - initX) >= 10) {
                initEvent.target.parentNode.width = width + endX - initX;
            }
            initEvent = null;
            initX = null;
            endX = null;
            window.addEventListener('mousemove', moveFn, false);
        }
    };
    window.addEventListener('mousedown', downFn, false);

    window.addEventListener('mouseup', upFn, false);
})();
