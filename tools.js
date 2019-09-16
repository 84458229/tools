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
    //DOM

    /*检测类名*/
    hasClass(ele, name) {
        return ele.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'));
    }

    /*添加类名*/
    addClass(ele, name) {
        if (!this.hasClass(ele, name)) ele.className += " " + name;
    }

    /*删除类名*/
    removeClass(ele, name) {
        if (this.hasClass(ele, name)) {
            var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
            ele.className = ele.className.replace(reg, '');
        }
    }

    /*替换类名*/
    replaceClass(ele, newName, oldName) {
        this.removeClass(ele, oldName);
        this.addClass(ele, newName);
    }

    /*获取兄弟节点*/
    siblings(ele) {
        //console.log(ele.parentNode)获取父节点
        var chid = ele.parentNode.children, eleMatch = [];
        for (var i = 0, len = chid.length; i < len; i++) {
            if (chid[i] != ele) {
                eleMatch.push(chid[i]);
            }
        }
        return eleMatch;
    }

    /*获取行间样式属性*/
    /*
      obj: dom节点
      attr:节点属性
    */
    getStyle(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, false)[attr];
        }
    }

    //多属性缓冲运动
    bufferMove(obj, target, fn, ratio) {
        var _this = this;
        var ratio = ratio || 8;
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var allOk = true;
            for (var attr in target) {
                var cur = 0;
                if (attr === 'opacity') {
                    cur = parseInt(_this.getStyle(obj, 'opacity') * 100);
                } else {
                    cur = parseInt(_this.getStyle(obj, attr));
                }
                var speed = (target[attr] - cur) / ratio;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                var next = speed + cur;
                if (attr === 'opacity') {
                    obj.style.opacity = next;
                    obj.style.opacity = 'alpha(opacity= ' + next + ') ';
                } else {
                    obj.style[attr] = next + 'px';
                }
                if (next !== target[attr]) {
                    allOk = false;
                }
            }
            if (allOk) {
                clearInterval(obj.timer);
                if (fn) {
                    fn();
                }
            }
        }, 50)
    }

    //添加事件兼容,绑定多个事件
    bindEvent(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn);
        } else {
            obj.attachEvent('on' + type, fn);
        }
    }

    //封装碰撞检测函数
    Impact(a, b) {
        if (
            a.offsetLeft + a.offsetWidth <= b.offsetLeft
            || a.offsetTop + a.offsetHeight <= b.offsetTop
            || b.offsetLeft + b.offsetWidth <= a.offsetLeft
            || b.offsetTop + b.offsetHeight <= a.offsetTop
        ) {
            return false;
        } else {
            return true;
        }
    }

    //创建存储唯一键名的函数
    createUniqueKey() {
        return new Date().getTime() + Math.random();
    }

    //Type类型判断
    isString(o) { //是否字符串
        return Object.prototype.toString.call(o).slice(8, -1) === 'String'
    }
    isNumber(o) { //是否数字
        return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
    }
    isObj(o) { //是否对象
        return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
    }
    isArray(o) { //是否数组
        return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
    }
    isDate(o) { //是否时间
        return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
    }
    isBoolean(o) { //是否boolean
        return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
    }
    isFunction(o) { //是否函数
        return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
    }
    isNull(o) { //是否为null
        return Object.prototype.toString.call(o).slice(8, -1) === 'Null'
    }
    isUndefined(o) { //是否undefined
        return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
    }
    isFalse(o) {
        if (o == '' || o == undefined || o == null || o == 'null' || o == 'undefined' || o == 0 || o == false || o == NaN) return true
        return false
    }
    isTrue(o) {
        return !this.isFalse(o)
    }
    isIos() {
        var u = navigator.userAgent;
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
            // return "Android";
            return false
        } else if (u.indexOf('iPhone') > -1) {//苹果手机
            // return "iPhone";
            return true
        } else if (u.indexOf('iPad') > -1) {//iPad
            // return "iPad";
            return false
        } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
            // return "Windows Phone";
            return false
        } else {
            return false
        }
    }
    isPC() { //是否为PC端
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
    //正则验证
    browserType() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
        var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) return "IE7"
            else if (fIEVersion == 8) return "IE8";
            else if (fIEVersion == 9) return "IE9";
            else if (fIEVersion == 10) return "IE10";
            else if (fIEVersion == 11) return "IE11";
            else return "IE7以下"//IE版本过低
        }

        if (isFF) return "FF";
        if (isOpera) return "Opera";
        if (isEdge) return "Edge";
        if (isSafari) return "Safari";
        if (isChrome) return "Chrome";
    }
    checkStr(str, type) {
        switch (type) {
            case 'phone':  //手机号码
                return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
            case 'tel':   //座机
                return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
            case 'card':  //身份证
                return /^\d{15}|\d{18}$/.test(str);
            case 'pwd':   //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
                return /^[a-zA-Z]\w{5,17}$/.test(str)
            case 'postal': //邮政编码
                return /[1-9]\d{5}(?!\d)/.test(str);
            case 'QQ':   //QQ号
                return /^[1-9][0-9]{4,9}$/.test(str);
            case 'email':  //邮箱
                return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
            case 'money':  //金额(小数点2位)
                return /^\d*(?:\.\d{0,2})?$/.test(str);
            case 'URL':   //网址
                return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
            case 'IP':   //IP
                return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
            case 'date':  //日期时间
                return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
            case 'number': //数字
                return /^[0-9]$/.test(str);
            case 'english': //英文
                return /^[a-zA-Z]+$/.test(str);
            case 'chinese': //中文
                return /^[\u4E00-\u9FA5]+$/.test(str);
            case 'lower':  //小写
                return /^[a-z]+$/.test(str);
            case 'upper':  //大写
                return /^[A-Z]+$/.test(str);
            case 'HTML':  //HTML标记
                return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
            default:
                return true;
        }
    }

    //data
    /**
     * 格式化时间
     *
     * @param {time} 时间
     * @param {cFormat} 格式
     * @return {String} 字符串
     *
     * @example formatTime('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
     */
    formatTime(time, cFormat) {
        if (arguments.length === 0) return null
        if ((time + '').length === 10) {
            time = +time * 1000
        }
        var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}', date
        if (typeof time === 'object') {
            date = time
        } else {
            date = new Date(time)
        }
        var formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            var value = formatObj[key]
            if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    }
    /**
     * 返回指定长度的月份集合
     *
     * @param {time} 时间
     * @param {len} 长度
     * @param {direction} 方向： 1: 前几个月; 2: 后几个月; 3:前后几个月 默认 3
     * @return {Array} 数组
     *
     * @example  getMonths('2018-1-29', 6, 1) // -> ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
     */
    getMonths(time, len, direction) {
        var mm = new Date(time).getMonth(),
            yy = new Date(time).getFullYear(),
            direction = isNaN(direction) ? 3 : direction,
            index = mm;
        var cutMonth = function (index) {
            if (index <= len && index >= -len) {
                return direction === 1 ? formatPre(index).concat(cutMonth(++index)) :
                    direction === 2 ? formatNext(index).concat(cutMonth(++index)) : formatCurr(index).concat(cutMonth(++index))
            }
            return []
        }
        var formatNext = function (i) {
            var y = Math.floor(i / 12),
                m = i % 12
            return [yy + y + '-' + (m + 1)]
        }
        var formatPre = function (i) {
            var y = Math.ceil(i / 12),
                m = i % 12
            m = m === 0 ? 12 : m
            return [yy - y + '-' + (13 - m)]
        }
        var formatCurr = function (i) {
            var y = Math.floor(i / 12),
                yNext = Math.ceil(i / 12),
                m = i % 12,
                mNext = m === 0 ? 12 : m
            return [yy - yNext + '-' + (13 - mNext), yy + y + '-' + (m + 1)]
        }
        var unique = function (arr) {
            if (Array.hasOwnProperty('from')) {
                return Array.from(new Set(arr));
            } else {
                var n = {}, r = [];
                for (var i = 0; i < arr.length; i++) {
                    if (!n[arr[i]]) {
                        n[arr[i]] = true;
                        r.push(arr[i]);
                    }
                }
                return r;
            }
        }
        return direction !== 3 ? cutMonth(index) : unique(cutMonth(index).sort(function (t1, t2) {
            return new Date(t1).getTime() - new Date(t2).getTime()
        }))
    }
    /**
     * 返回指定长度的天数集合
     *
     * @param {time} 时间
     * @param {len} 长度
     * @param {direction} 方向： 1: 前几天; 2: 后几天; 3:前后几天 默认 3
     * @return {Array} 数组
     *
     * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
     */
    getDays(time, len, diretion) {
        var tt = new Date(time)
        var getDay = function (day) {
            var t = new Date(time)
            t.setDate(t.getDate() + day)
            var m = t.getMonth() + 1
            return t.getFullYear() + '-' + m + '-' + t.getDate()
        }
        var arr = []
        if (diretion === 1) {
            for (var i = 1; i <= len; i++) {
                arr.unshift(getDay(-i))
            }
        } else if (diretion === 2) {
            for (var i = 1; i <= len; i++) {
                arr.push(getDay(i))
            }
        } else {
            for (var i = 1; i <= len; i++) {
                arr.unshift(getDay(-i))
            }
            arr.push(tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate())
            for (var i = 1; i <= len; i++) {
                arr.push(getDay(i))
            }
        }
        return diretion === 1 ? arr.concat([tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()]) :
            diretion === 2 ? [tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()].concat(arr) : arr
    }
    /**
     * @param {s} 秒数
     * @return {String} 字符串
     *
     * @example formatHMS(3610) // -> 1h0m10s
     */
    formatHMS(s) {
        var str = ''
        if (s > 3600) {
            str = Math.floor(s / 3600) + 'h' + Math.floor(s % 3600 / 60) + 'm' + s % 60 + 's'
        } else if (s > 60) {
            str = Math.floor(s / 60) + 'm' + s % 60 + 's'
        } else {
            str = s % 60 + 's'
        }
        return str
    }
    /*获取某月有多少天*/
    getMonthOfDay(time) {
        var date = new Date(time)
        var year = date.getFullYear()
        var mouth = date.getMonth() + 1
        var days

        //当月份为二月时，根据闰年还是非闰年判断天数
        if (mouth == 2) {
            days = year % 4 == 0 ? 29 : 28
        } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
            //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
            days = 31
        } else {
            //其他月份，天数为：30.
            days = 30
        }
        return days
    }
    /*获取某年有多少天*/
    getYearOfDay(time) {
        var firstDayYear = this.getFirstDayOfYear(time);
        var lastDayYear = this.getLastDayOfYear(time);
        var numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime()) / 1000;
        return Math.ceil(numSecond / (24 * 3600));
    }
    /*获取某年的第一天*/
    getFirstDayOfYear(time) {
        var year = new Date(time).getFullYear();
        return year + "-01-01 00:00:00";
    }
    /*获取某年最后一天*/
    getLastDayOfYear(time) {
        var year = new Date(time).getFullYear();
        var dateString = year + "-12-01 00:00:00";
        var endDay = this.getMonthOfDay(dateString);
        return year + "-12-" + endDay + " 23:59:59";
    }
    /*获取某个日期是当年中的第几天*/
    getDayOfYear(time) {
        var firstDayYear = this.getFirstDayOfYear(time);
        var numSecond = (new Date(time).getTime() - new Date(firstDayYear).getTime()) / 1000;
        return Math.ceil(numSecond / (24 * 3600));
    }
    /*获取某个日期在这一年的第几周*/
    getDayOfYearWeek(time) {
        var numdays = this.getDayOfYear(time);
        return Math.ceil(numdays / 7);
    }

    //Array
    /*判断一个元素是否在数组中*/
    contains(arr, val) {
        return arr.indexOf(val) != -1 ? true : false;
    }
    /**
     * @param {arr} 数组
     * @param {fn} 回调函数
     * @return {undefined}
     */
    each(arr, fn) {
        fn = fn || Function;
        var a = [];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < arr.length; i++) {
            var res = fn.apply(arr, [arr[i], i].concat(args));
            if (res != null) a.push(res);
        }
    }
    /**
     * @param {arr} 数组
     * @param {fn} 回调函数
     * @param {thisObj} this指向
     * @return {Array}
     */
    map(arr, fn, thisObj) {
        var scope = thisObj || window;
        var a = [];
        for (var i = 0, j = arr.length; i < j; ++i) {
            var res = fn.call(scope, arr[i], i, this);
            if (res != null) a.push(res);
        }
        return a;
    }
    /**
     * @param {arr} 数组
     * @param {type} 1：从小到大  2：从大到小  3：随机
     * @return {Array}
     */
    sort(arr, type = 1) {
        return arr.sort((a, b) => {
            switch (type) {
                case 1:
                    return a - b;
                case 2:
                    return b - a;
                case 3:
                    return Math.random() - 0.5;
                default:
                    return arr;
            }
        })
    }

    /*去重*/
    unique(arr) {
        if (Array.hasOwnProperty('from')) {
            return Array.from(new Set(arr));
        } else {
            var n = {}, r = [];
            for (var i = 0; i < arr.length; i++) {
                if (!n[arr[i]]) {
                    n[arr[i]] = true;
                    r.push(arr[i]);
                }
            }
            return r;
        }
    }

    /*求两个集合的并集*/
    union(a, b) {
        var newArr = a.concat(b);
        return this.unique(newArr);
    }

    /*求两个集合的交集*/
    intersect(a, b) {
        var _this = this;
        a = this.unique(a);
        return this.map(a, function (o) {
            return _this.contains(b, o) ? o : null;
        });
    }

    /*删除其中一个元素*/
    remove(arr, ele) {
        var index = arr.indexOf(ele);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    /*将类数组转换为数组的方法*/
    formArray(ary) {
        var arr = [];
        if (Array.isArray(ary)) {
            arr = ary;
        } else {
            arr = Array.prototype.slice.call(ary);
        };
        return arr;
    }

    /*最大值*/
    max(arr) {
        return Math.max.apply(null, arr);
    }

    /*最小值*/
    min(arr) {
        return Math.min.apply(null, arr);
    }

    /*求和*/
    sum(arr) {
        return arr.reduce((pre, cur) => {
            return pre + cur
        })
    }

    /*平均值*/
    average(arr) {
        return this.sum(arr) / arr.length
    }

    //String

    /**
     * 去除空格
     * @param {str}
     * @param {type}
     *    type: 1-所有空格 2-前后空格 3-前空格 4-后空格
     * @return {String}
     */
    trim(str, type) {
        type = type || 1
        switch (type) {
            case 1:
                return str.replace(/\s+/g, "");
            case 2:
                return str.replace(/(^\s*)|(\s*$)/g, "");
            case 3:
                return str.replace(/(^\s*)/g, "");
            case 4:
                return str.replace(/(\s*$)/g, "");
            default:
                return str;
        }
    }

    /**
     * @param {str}
     * @param {type}
     *    type: 1:首字母大写 2：首页母小写 3：大小写转换 4：全部大写 5：全部小写
     * @return {String}
     */
    changeCase(str, type) {
        type = type || 4
        switch (type) {
            case 1:
                return str.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();

                });
            case 2:
                return str.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
                });
            case 3:
                return str.split('').map(function (word) {
                    if (/[a-z]/.test(word)) {
                        return word.toUpperCase();
                    } else {
                        return word.toLowerCase()
                    }
                }).join('')
            case 4:
                return str.toUpperCase();
            case 5:
                return str.toLowerCase();
            default:
                return str;
        }
    }

    /*
      检测密码强度
    */
    checkPwd(str) {
        var Lv = 0;
        if (str.length < 6) {
            return Lv
        }
        if (/[0-9]/.test(str)) {
            Lv++
        }
        if (/[a-z]/.test(str)) {
            Lv++
        }
        if (/[A-Z]/.test(str)) {
            Lv++
        }
        if (/[\.|-|_]/.test(str)) {
            Lv++
        }
        return Lv;
    }

    /*过滤html代码(把<>转换)*/
    filterTag(str) {
        str = str.replace(/&/ig, "&");
        str = str.replace(/</ig, "<");
        str = str.replace(/>/ig, ">");
        str = str.replace(" ", " ");
        return str;
    }

    //Numbr

    /*随机数范围*/
    random(min, max) {
        if (arguments.length === 2) {
            return Math.floor(min + Math.random() * ((max + 1) - min))
        } else {
            return null;
        }

    }

    /*将阿拉伯数字翻译成中文的大写数字*/
    numberToChinese(num) {
        var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
        var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
        var a = ("" + num).replace(/(^0*)/g, "").split("."),
            k = 0,
            re = "";
        for (var i = a[0].length - 1; i >= 0; i--) {
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
                        .test(a[0]))
                        re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
                re = AA[0] + re;
            if (a[0].charAt(i) != 0)
                re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            k++;
        }

        if (a.length > 1) // 加上小数部分(如果有小数部分)
        {
            re += BB[6];
            for (var i = 0; i < a[1].length; i++)
                re += AA[a[1].charAt(i)];
        }
        if (re == '一十')
            re = "十";
        if (re.match(/^一/) && re.length == 3)
            re = re.replace("一", "");
        return re;
    }

    /*将数字转换为大写金额*/
    changeToChinese(Num) {
        //判断如果传递进来的不是字符的话转换为字符
        if (typeof Num == "number") {
            Num = new String(Num);
        };
        Num = Num.replace(/,/g, "") //替换tomoney()中的“,”
        Num = Num.replace(/ /g, "") //替换tomoney()中的空格
        Num = Num.replace(/￥/g, "") //替换掉可能出现的￥字符
        if (isNaN(Num)) { //验证输入的字符是否为数字
            //alert("请检查小写金额是否正确");
            return "";
        };
        //字符处理完毕后开始转换，采用前后两部分分别转换
        var part = String(Num).split(".");
        var newchar = "";
        //小数点前进行转化
        for (var i = part[0].length - 1; i >= 0; i--) {
            if (part[0].length > 10) {
                return "";
                //若数量超过拾亿单位，提示
            }
            var tmpnewchar = ""
            var perchar = part[0].charAt(i);
            switch (perchar) {
                case "0":
                    tmpnewchar = "零" + tmpnewchar;
                    break;
                case "1":
                    tmpnewchar = "壹" + tmpnewchar;
                    break;
                case "2":
                    tmpnewchar = "贰" + tmpnewchar;
                    break;
                case "3":
                    tmpnewchar = "叁" + tmpnewchar;
                    break;
                case "4":
                    tmpnewchar = "肆" + tmpnewchar;
                    break;
                case "5":
                    tmpnewchar = "伍" + tmpnewchar;
                    break;
                case "6":
                    tmpnewchar = "陆" + tmpnewchar;
                    break;
                case "7":
                    tmpnewchar = "柒" + tmpnewchar;
                    break;
                case "8":
                    tmpnewchar = "捌" + tmpnewchar;
                    break;
                case "9":
                    tmpnewchar = "玖" + tmpnewchar;
                    break;
            }
            switch (part[0].length - i - 1) {
                case 0:
                    tmpnewchar = tmpnewchar + "元";
                    break;
                case 1:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
                    break;
                case 2:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
                    break;
                case 3:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
                    break;
                case 4:
                    tmpnewchar = tmpnewchar + "万";
                    break;
                case 5:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
                    break;
                case 6:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
                    break;
                case 7:
                    if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
                    break;
                case 8:
                    tmpnewchar = tmpnewchar + "亿";
                    break;
                case 9:
                    tmpnewchar = tmpnewchar + "拾";
                    break;
            }
            var newchar = tmpnewchar + newchar;
        }
        //小数点之后进行转化
        if (Num.indexOf(".") != -1) {
            if (part[1].length > 2) {
                // alert("小数点之后只能保留两位,系统将自动截断");
                part[1] = part[1].substr(0, 2)
            }
            for (i = 0; i < part[1].length; i++) {
                tmpnewchar = ""
                perchar = part[1].charAt(i)
                switch (perchar) {
                    case "0":
                        tmpnewchar = "零" + tmpnewchar;
                        break;
                    case "1":
                        tmpnewchar = "壹" + tmpnewchar;
                        break;
                    case "2":
                        tmpnewchar = "贰" + tmpnewchar;
                        break;
                    case "3":
                        tmpnewchar = "叁" + tmpnewchar;
                        break;
                    case "4":
                        tmpnewchar = "肆" + tmpnewchar;
                        break;
                    case "5":
                        tmpnewchar = "伍" + tmpnewchar;
                        break;
                    case "6":
                        tmpnewchar = "陆" + tmpnewchar;
                        break;
                    case "7":
                        tmpnewchar = "柒" + tmpnewchar;
                        break;
                    case "8":
                        tmpnewchar = "捌" + tmpnewchar;
                        break;
                    case "9":
                        tmpnewchar = "玖" + tmpnewchar;
                        break;
                }
                if (i == 0) tmpnewchar = tmpnewchar + "角";
                if (i == 1) tmpnewchar = tmpnewchar + "分";
                newchar = newchar + tmpnewchar;
            }
        }
        //替换所有无用汉字
        while (newchar.search("零零") != -1)
            newchar = newchar.replace("零零", "零");
        newchar = newchar.replace("零亿", "亿");
        newchar = newchar.replace("亿万", "亿");
        newchar = newchar.replace("零万", "万");
        newchar = newchar.replace("零元", "元");
        newchar = newchar.replace("零角", "");
        newchar = newchar.replace("零分", "");
        if (newchar.charAt(newchar.length - 1) == "元") {
            newchar = newchar + "整"
        }
        return newchar;
    }

    //HTTP
    /*-----------------cookie---------------------*/
    /*设置cookie*/
    setCookie(name, value, day) {
        var setting = arguments[0];
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (var i in setting) {
                var oDate = new Date();
                oDate.setDate(oDate.getDate() + day);
                document.cookie = i + '=' + setting[i] + ';expires=' + oDate;
            }
        } else {
            var oDate = new Date();
            oDate.setDate(oDate.getDate() + day);
            document.cookie = name + '=' + value + ';expires=' + oDate;
        }

    }

    /*获取cookie*/
    getCookie(name) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                return arr2[1];
            }
        }
        return '';
    }

    /*删除cookie*/
    removeCookie(name) {
        this.setCookie(name, 1, -1);
    }

    /**
         * @param {url}
         * @param {setting}
         * @return {Promise}
         */
    fetch(url, setting) {
        //设置参数的初始值
        let opts = {
            method: (setting.method || 'GET').toUpperCase(), //请求方式
            headers: setting.headers || {}, // 请求头设置
            credentials: setting.credentials || true, // 设置cookie是否一起发送
            body: setting.body || {},
            mode: setting.mode || 'no-cors', // 可以设置 cors, no-cors, same-origin
            redirect: setting.redirect || 'follow', // follow, error, manual
            cache: setting.cache || 'default' // 设置 cache 模式 (default, reload, no-cache)
        }
        let dataType = setting.dataType || "json", // 解析方式
            data = setting.data || "" // 参数

        // 参数格式化
        function params_format(obj) {
            var str = ''
            for (var i in obj) {
                str += `${i}=${obj[i]}&`
            }
            return str.split('').slice(0, -1).join('')
        }

        if (opts.method === 'GET') {
            url = url + (data ? `?${params_format(data)}` : '')
        } else {
            setting.body = data || {}
        }
        return new Promise((resolve, reject) => {
            fetch(url, opts).then(async res => {
                let data = dataType === 'text' ? await res.text() :
                    dataType === 'blob' ? await res.blob() : await res.json()
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }
    //获取客户端ip地址需创建id为address的标签
    getYourIP() {
        var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        if (RTCPeerConnection) (function () {
            var rtc = new RTCPeerConnection({ iceServers: [] });
            if (1 || window.mozRTCPeerConnection) {
                rtc.createDataChannel('', { reliable: false });
            };
            rtc.onicecandidate = function (evt) {
                if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
            };
            rtc.createOffer(function (offerDesc) {
                grepSDP(offerDesc.sdp);
                rtc.setLocalDescription(offerDesc);
            }, function (e) { console.warn("offer failed", e); });
            var addrs = Object.create(null);
            addrs["0.0.0.0"] = false;
            function updateDisplay(newAddr) {
                if (newAddr in addrs) return;
                else addrs[newAddr] = true;
                var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
                for (var i = 0; i < displayAddrs.length; i++) {
                    if (displayAddrs[i].length > 16) {
                        displayAddrs.splice(i, 1);
                        i--;
                    }
                }
                document.getElementById('address').textContent = displayAddrs[0];
            }
            function grepSDP(sdp) {
                var hosts = [];
                sdp.split('\r\n').forEach(function (line, index, arr) {
                    if (~line.indexOf("a=candidate")) {
                        var parts = line.split(' '),
                            addr = parts[4],
                            type = parts[7];
                        if (type === 'host') updateDisplay(addr);
                    } else if (~line.indexOf("c=")) {
                        var parts = line.split(' '),
                            addr = parts[2];
                        updateDisplay(addr);
                    }
                });
            }
        })();
        else {
            document.getElementById('address').textContent = "请使用主流浏览器：chrome,firefox,opera,safari"
            //                  console.log("请使用主流浏览器：chrome,firefox,opera,safari");
        }

    }
    //获取浏览器的信息
    getBrowserInfo() {
        var agent = navigator.userAgent.toLowerCase();
        console.log(agent);
        var arr = [];
        var system = agent.split(' ')[1].split(' ')[0].split('(')[1];
        arr.push(system);
        var regStr_edge = /edge\/[\d.]+/gi;
        var regStr_ie = /trident\/[\d.]+/gi;
        var regStr_ff = /firefox\/[\d.]+/gi;
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        var regStr_opera = /opr\/[\d.]+/gi;
        //IE
        if (agent.indexOf("trident") > 0) {
            arr.push(agent.match(regStr_ie)[0].split('/')[0]);
            arr.push(agent.match(regStr_ie)[0].split('/')[1]);
            return arr;
        }
        //Edge
        if (agent.indexOf('edge') > 0) {
            arr.push(agent.match(regStr_edge)[0].split('/')[0]);
            arr.push(agent.match(regStr_edge)[0].split('/')[1]);
            return arr;
        }
        //firefox
        if (agent.indexOf("firefox") > 0) {
            arr.push(agent.match(regStr_ff)[0].split('/')[0]);
            arr.push(agent.match(regStr_ff)[0].split('/')[1]);
            return arr;
        }
        //Opera
        if (agent.indexOf("opr") > 0) {
            arr.push(agent.match(regStr_opera)[0].split('/')[0]);
            arr.push(agent.match(regStr_opera)[0].split('/')[1]);
            return arr;
        }
        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            arr.push(agent.match(regStr_saf)[0].split('/')[0]);
            arr.push(agent.match(regStr_saf)[0].split('/')[1]);
            return arr;
        }
        //Chrome
        if (agent.indexOf("chrome") > 0) {
            arr.push(agent.match(regStr_chrome)[0].split('/')[0]);
            arr.push(agent.match(regStr_chrome)[0].split('/')[1]);
            return arr;
        } else {
            arr.push('请更换主流浏览器，例如chrome,firefox,opera,safari,IE,Edge!')
            return arr;
        }
    }

    //Other
    /*获取网址参数,name为网址中的参数键值*/
    getURL(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2]; return null;
    }

    /*获取全部url参数,并转换成json对象*/
    getUrlAllParams(url) {
        var url = url ? url : window.location.href;
        var _pa = url.substring(url.indexOf('?') + 1),
            _arrS = _pa.split('&'),
            _rs = {};
        for (var i = 0, _len = _arrS.length; i < _len; i++) {
            var pos = _arrS[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            var name = _arrS[i].substring(0, pos),
                value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
            _rs[name] = value;
        }
        return _rs;
    }

    /*删除url指定参数，返回url*/
    delParamsUrl(url, name) {
        var baseUrl = url.split('?')[0] + '?';
        var query = url.split('?')[1];
        if (query.indexOf(name) > -1) {
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
            return url
        } else {
            return url;
        }
    }

    /*获取十六进制随机颜色*/
    getRandomColor() {
        return '#' + (function (h) {
            return new Array(7 - h.length).join("0") + h;
        })((Math.random() * 0x1000000 << 0).toString(16));
    }

    /*图片加载*/
    imgLoadAll(arr, callback) {
        var arrImg = [];
        for (var i = 0; i < arr.length; i++) {
            var img = new Image();
            console.log(img);
            img.src = arr[i];
            img.onload = function () {
                arrImg.push(this);
                if (arrImg.length == arr.length) {
                    callback && callback();
                }
            }
        }
    }

    /*音频加载*/
    loadAudio(src, callback) {
        var audio = new Audio(src);
        audio.onloadedmetadata = callback;
        audio.src = src;
    }

    /*DOM转字符串*/
    domToStirng(htmlDOM) {
        var div = document.createElement("div");
        div.appendChild(htmlDOM);
        return div.innerHTML
    }

    /*字符串转DOM*/
    stringToDom(htmlString) {
        var div = document.createElement("div");
        div.innerHTML = htmlString;
        return div.children[0];
    }

    /**
     * 光标所在位置插入字符，并设置光标位置
     *
     * @param {dom} 输入框
     * @param {val} 插入的值
     * @param {posLen} 光标位置处在 插入的值的哪个位置
     */
    setCursorPosition(dom, val, posLen) {
        var cursorPosition = 0;
        if (dom.selectionStart) {
            cursorPosition = dom.selectionStart;
        }
        this.insertAtCursor(dom, val);
        dom.focus();
        console.log(posLen)
        dom.setSelectionRange(dom.value.length, cursorPosition + (posLen || val.length));
    }

    /*光标所在位置插入字符*/
    insertAtCursor(dom, val) {
        if (document.selection) {
            dom.focus();
            sel = document.selection.createRange();
            sel.text = val;
            sel.select();
        } else if (dom.selectionStart || dom.selectionStart == '0') {
            let startPos = dom.selectionStart;
            let endPos = dom.selectionEnd;
            let restoreTop = dom.scrollTop;
            dom.value = dom.value.substring(0, startPos) + val + dom.value.substring(endPos, dom.value.length);
            if (restoreTop > 0) {
                dom.scrollTop = restoreTop;
            }
            dom.focus();
            dom.selectionStart = startPos + val.length;
            dom.selectionEnd = startPos + val.length;
        } else {
            dom.value += val;
            dom.focus();
        }
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

