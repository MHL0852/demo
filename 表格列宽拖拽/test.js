(function () {
    let initX,
        initEvent,
        containerWidth,
        width,
        endX;
    /*let getTop = function (dom, data) {
        console.dir(dom);
        if (dom.offsetParent.nodeName === 'BODY') {
            data.top += dom.offsetTop;
            return data
        } else {
            data.top += dom.offsetTop;
            return getTop(dom.offsetParent, data)
        }
    };*/

    let headContent = document.getElementById('tabHeader').rows[0].cells;
    [].forEach.call(headContent,item=>{
        let line = document.createElement('div');
        line.className = 'line';
        item.appendChild(line)
    });

    let downFn = function (e) {
        e = e || window.event;
        if (e.target.className === 'line') {
            initX = e.clientX;
            width = getComputedStyle(e.target.parentNode).width;
            width = parseFloat(width);
            initEvent = e;
            window.addEventListener('mousemove', moveFn, false);
            containerWidth = parseFloat(getComputedStyle(e.target.parentNode.parentNode.parentNode.parentNode).width)
        }
    };

    let moveFn = function (e) {
        e = e || window.event;
        if (initEvent) {
            endX = e.clientX;
            console.log(e);
            initEvent.target.style.position='fixed';
            initEvent.target.style.top=getTop(initEvent.target,{top:0}).top+'px';
            initEvent.target.style.left=e.screenX+'px';
            initEvent.target.style.background='#000';
            initEvent.target.style.border='1px solid #ccc';
          /*  if (Math.abs(endX - initX) >= 10) {
                if ((initEvent.target.parentNode.clientWidth === 352) && (endX - initX <= 0)) {
                    return
                }
                initEvent.target.parentNode.width = Math.round(width + endX - initX);
                initEvent.target.parentNode.parentNode.parentNode.parentNode.style.width = Math.round(containerWidth + endX - initX) + 'px';
            }*/
            // endX = null;
        }
    };

    let upFn = function (e) {
        e = e || window.event;
        endX = e.clientX;
        if (initEvent) {
            if (Math.abs(endX - initX) >= 10) {
                if ((initEvent.target.parentNode.clientWidth === 352) && (endX - initX <= 0)) {
                    initEvent = null;
                    initX = null;
                    endX = null;
                    window.removeEventListener('mousemove', moveFn, false);
                    return
                }
                initEvent.target.parentNode.width = Math.round(width + endX - initX);
                initEvent.target.parentNode.parentNode.parentNode.parentNode.style.width = Math.round(containerWidth + endX - initX) + 'px';
            }
            initEvent = null;
            initX = null;
            endX = null;
            window.removeEventListener('mousemove', moveFn, false)
        }
    };
    window.addEventListener('mousedown', downFn, false);

    window.addEventListener('mouseup', upFn, false)
})();