var newsRender = (function () {
    var _newsData = null,
        _newsBox = document.getElementById('newsBox');

    //=>queryData:使用AJAX获取到需要绑定的数据
    function queryData() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', 'json/news.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                _newsData = utils.toJSON(xhr.responseText);
            }
        };
        xhr.send(null);
    }

    //=>bindHTML:根据获取的数据把HTML绑定在页面中
    function bindHTML() {
        if (!_newsData) return;
        var str = ``;
        for (var i = 0; i < _newsData.length; i++) {
            var item = _newsData[i];
            str += `<li><a href="${item.link}">
                <div class="imgBox">
                    <img src="" data-img="${item.figure}" alt="">
                </div>
                <div class="con">
                    <p class="title">${item.title}</p>
                    <span>${item.comment}</span>
                </div>
            </a></li>`;
        }
        _newsBox.innerHTML = str;
    }

    //=>computed：计算出哪些图片需要延迟加载,我们让其延迟加载
    function computed() {
        var imgList = _newsBox.getElementsByTagName('img');
        for (var i = 0; i < imgList.length; i++) {
            var curImg = imgList[i],
                curBox = curImg.parentNode;
            if (curImg.isLoad) continue;//=>如果当前图片已经处理过了,我们不需要再重复处理,直接进行下一轮的循环,验证下一张图片是否需要加载即可

            //=>获取“图片所在盒子底边框距离BODY的距离 A” 和 “浏览器底边框距离BODY的距离 B”
            var A = utils.offset(curBox)['top'] + curBox.offsetHeight;
            var B = utils.winBox('clientHeight') + utils.winBox('scrollTop');
            if (A <= B) {
                //=>当前这张图片符合延迟加载的条件,我们开始加载
                lazyImg(curImg);
            }
        }
    }

    //=>lazyImg:给某一张图片进行延迟加载
    function lazyImg(curImg) {
        curImg.isLoad = true;//=>避免重复处理(isLoad:是自定义属性)
        var tempImg = new Image;
        tempImg.onload = function () {
            curImg.src = tempImg.src;
            curImg.style.display = 'block';
            imgFade(curImg);
            tempImg = null;
        };
        tempImg.src = curImg.getAttribute('data-img');
    }

    //=>imgFade：让当前图片渐现出来
    function imgFade(curImg) {
        var n = 0;
        var timer = setInterval(function () {
            if (n > 1) {
                clearInterval(timer);
                timer = null;
                return;
            }
            n += 0.05;
            utils.css(curImg, 'opacity', n);
        }, 17);//=>17MS是执行定时器动画相对比较理想的间隔时间
    }

    return {
        init: function () {
            //=>模块的入口:在入口中协调控制先做什么再做什么
            queryData();
            bindHTML();

            setTimeout(computed, 500);//=>当页面中数据都加载完成,过500MS在执行图片的延迟加载操作 <=> window.onload=computed 这个事件就是页面整体都加载完成才会触发
            window.onscroll = computed;//=>当滚动到具体的区域的时候,我们把当前符合条件的图片做延迟加载
        }
    }
})();
newsRender.init();