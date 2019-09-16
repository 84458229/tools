/**
 * liu_xl tool 库
 */
let Tools = class {
    constructor() {
        return this;
    }
    colorRgba(str, n) {
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = str.toLowerCase();
        //十六进制颜色转换为RGB格式
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {  //例如：#eee,#fff等
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "rgba(" + sColorChange.join(",") + "," + n + ")";
        } else {
            return sColor;
        }
    }

    /**
     * 过滤字符串特殊字符
     * @param str
     * @returns {string}
     */
    filterStr(str) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
        var specialStr = "";
        for (var i = 0; i < str.length; i++) {
            specialStr += str.substr(i, 1).replace(pattern, '');
        }
        return specialStr;
    }


    /**
     * @param {*} opts 
     *参数说明：
     *opts: {'可选参数'}
     *method: 请求方式:GET/POST,默认值:'POST';
     *url:    发送请求的地址, 默认值: 当前页地址;
     *data: string,json;
     *async: 是否异步:true/false,默认值:true;
     *cache: 是否缓存：true/false,默认值:true;
     *contentType: HTTP头信息，默认值：'application/x-www-form-urlencoded;charset=utf-8';
     *success: 请求成功后的回调函数;
     *error: 请求失败后的回调函数;
     */
    Ajax(opts) {
        //一.设置默认参数
        var defaults = {
            method: 'POST',
            url: '',
            data: '',
            async: true,
            cache: true,
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            success: function () { },
            error: function () { }
        };

        //二.用户参数覆盖默认参数    
        for (var key in opts) {
            defaults[key] = opts[key];
        }

        //三.对数据进行处理
        if (typeof defaults.data === 'object') {    //处理 data
            var str = '';
            var value = '';
            for (var key in defaults.data) {
                value = defaults.data[key];
                if (defaults.data[key].indexOf('&') !== -1) value = defaults.data[key].replace(/&/g, escape('&'));   //对参数中有&进行兼容处理
                if (key.indexOf('&') !== -1) key = key.replace(/&/g, escape('&'));   //对参数中有&进行兼容处理
                str += key + '=' + value + '&';
            }
            defaults.data = str.substring(0, str.length - 1);
        }

        defaults.method = defaults.method.toUpperCase();    //处理 method

        defaults.cache = defaults.cache ? '' : '&' + new Date().getTime();//处理 cache

        if (defaults.method === 'GET' && (defaults.data || defaults.cache)) defaults.url += '?' + defaults.data + defaults.cache;    //处理 url    

        //四.开始编写ajax
        //1.创建ajax对象
        var oXhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        //2.和服务器建立联系，告诉服务器你要取什么文件
        oXhr.open(defaults.method, defaults.url, defaults.async);
        //3.发送请求
        if (defaults.method === 'GET')
            oXhr.send(null);
        else {
            oXhr.setRequestHeader("Content-type", defaults.contentType);
            oXhr.send(defaults.data);
        }
        //4.等待服务器回应
        oXhr.onreadystatechange = function () {
            if (oXhr.readyState === 4) {
                if (oXhr.status === 200)
                    defaults.success.call(oXhr, oXhr.responseText);
                else {
                    defaults.error();
                }
            }
        };
    }



}
module.exports = tools;

/**
 * 移动适配
 */
(function () {
    adaptUILayout()
    function adaptUILayout() {

        var deviceWidth,
            devicePixelRatio,
            targetDensitydpi,
            //meta,
            initialContent,
            head,
            viewport,
            ua;

        ua = navigator.userAgent.toLowerCase();
        //whether it is the iPhone or iPad
        isiOS = ua.indexOf('ipad') > -1 || ua.indexOf('iphone') > -1;

        //设置像素比
        devicePixelRatio = window.devicePixelRatio;
        devicePixelRatio < 1.5 ? 2 : devicePixelRatio;

        if (window.orientation == 0 || window.orientation == 180) {//ios的横屏，安卓的竖屏
            if (window.screen.width < window.screen.height) {
                deviceWidth = window.screen.width;
            } else {
                deviceWidth = window.screen.height;
            }
        } else {//ios的竖屏，安卓的横屏
            if (window.screen.width > window.screen.height) {
                deviceWidth = window.screen.width;
            } else {
                deviceWidth = window.screen.height;
            }
        }
        //动态的改变像素比
        if (devicePixelRatio == 2 && (deviceWidth == 320 || deviceWidth == 360 || deviceWidth == 592 || deviceWidth == 640)) {
            deviceWidth *= 2;
        }

        if (devicePixelRatio == 1.5 && (deviceWidth == 320)) {
            deviceWidth *= 2;
            devicePixelRatio = 2;
        }
        if (devicePixelRatio == 1.5 && (deviceWidth == 750)) {
            devicePixelRatio = 2;
        }

        //设置设备的独立像素比api
        targetDensitydpi = 750 / deviceWidth * devicePixelRatio * 160;
        创建meta标签
        initialContent = isiOS
            ? 'width=' + 750 + 'px, user-scalable=no, minimal-ui'
            : 'target-densitydpi=' + targetDensitydpi + ', width=' + 750 + ', user-scalable=no';

        $("#viewport").remove();
        var head = document.getElementsByTagName('head');
        var viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.id = 'viewport';
        viewport.content = initialContent;

        head.length > 0 && head[head.length - 1].appendChild(viewport);
    }

    $(window).bind('orientationchange', function (e) {
        adaptUILayout()
    });
})();

/**
 * 淘宝适配方案
 */
(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});

    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }
    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }
    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }
    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }
    win.addEventListener('resize', function () {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);
    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }

    refreshRem();
    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function (d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }
})(window, window['lib'] || (window['lib'] = {}));

/**
   * 扩展数组方法，判断数组相等
   */
Array.prototype.equals = function (array) {
    if (!array)
        return false;
    if (this.length !== array.length)
        return false;
    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
}

