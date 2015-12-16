'use strict';
(function(window){
    window.BigEye = BigEye;
    var self = null;

    function BigEye(){
        self = this;
    }


    function Show360(options){
        var s360 = this;

        s360.setDefaults = function(options){
            self.extend(true,defaults,options);
        };
        s360.easeStop = function(now,callback){
            var r = range > 0 ? 1 : -1;
            if(now<Math.abs(range)*2){
                opt.easeTime = setTimeout(function(){
                    s360.turnRotate( range+r-Math.ceil(self.tween.Circ.easeOut(now,0,range,Math.abs(range)*2)) );
                    s360.easeStop(now+1,callback);
                },Math.ceil(self.tween.Circ.easeIn(now,10,30,Math.abs(range)*2)));
            }else{
                if(typeof callback != 'undefined'){
                    callback.call(this,range);
                }
            }
        };
        s360.turnRotate = function(range){
            opt.ele_ol.childNodes[opt.active - 1].style.visibility = "hidden";
            opt.active -= range;
            if(opt.active < 1){
                opt.active = opt.imgTotal - 1 + opt.active % opt.imgTotal;
            }
            if(opt.active > opt.imgTotal){
                opt.active = opt.active % opt.imgTotal +1;
            }
            opt.ele_ol.childNodes[opt.active - 1].style.visibility = "visible";
        };
        s360.setSize = function(width,height,unit){
            var u = typeof unit == 'undefined' ? 'px' : unit;
            //if(typeof width != 'number' || typeof height != 'number'){
            //    return console.warn('请输入有效的number类型');
            //}
            if(typeof width == 'number' && typeof height == 'number'){
                defaults.width = width == '' ? '100%' : width+''+u;
                defaults.height = height == '' ? '100%' : height+''+u;
            }else{
                defaults.width = width == '' ? '100%' : width;
                defaults.height = height == '' ? '100%' : height;
            }
        };
        s360.autoPlay = function(f){
            if(f){
                s360.turnRotate(1);
                opt.autoPlayTime = setTimeout(function(){
                    s360.autoPlay(defaults.autoPlay);
                },defaults.autoPlaySpeed)
            }
        };

        var defaults = {
            element: '',                // 目标元素
            width: '',                  // 元素宽度，不设置为自适应
            height: '',                 // 元素高度，不设置为自适应
            rotateRange: '2',           // 旋转单张角度
            sensibility: '2',           // 灵敏度，描述鼠标滑动距离和角度的关系
            imgPath: 'pic/',            // 图片相对路径
            imgPrefix: 'show360_',   // 图片名称前缀
            reserveNumberLength: '0',
            imgType: 'jpg',             // 图片类型

            startIndex: '1',            // 从第几张图开始
            maxScale: '3',              // 最大放大倍率，1表示不需要放大功能
            autoPlay: false,            // 是否可以自动播放
            autoPlaySpeed: 20,          // 自动播放速度
            loading: true,              // 是否需要预加载
            loadProcess: null,          // 加载中回调
            loadComplete: null          // 加载完成

        };
        self.extend(true,defaults,options);
        s360.setSize(defaults.width,defaults.height);

        s360.opt = defaults;
        var consts = {
            rotate: 360
        };
        var opt = {
            // 组件根部对象
            ele : document.querySelector(defaults.element),
            scale : 1,
            ele_ol : null,
            moveLock : true,
            imgTotal : consts.rotate/defaults.rotateRange,
            active: parseInt(defaults.startIndex),
            autoPlayTime: null,
            gesture: {
                scale: 1,
                gestured : false,
                eleW: 0,
                eleH: 0,
                x: 0,
                y: 0,
                ox: 50,
                oy: 50,
                touchList:[
                    {
                        pageX:0,
                        pageY:0
                    },
                    {
                        pageX:0,
                        pageY:0
                    }
                ]
            },
            origin:{
                x: '50%',
                y: '50%'
            },
            easeTime : null
        };

        var imgLoadState = {
            imgArr : [],
            imgComplete : 0,
            loadProgress : 0

        };

        _renderList(opt.ele);
        var eleX = -1,
            range = 0;

        self.addEvent(opt.ele,'mousedown',mouseDown);
        self.addEvent(document,'mouseup',mouseUp);
        self.addEvent(document,'mousemove',mouseMove);
        self.addEvent(opt.ele,'mousewheel',mouseScale);
        self.addEvent(opt.ele,'DOMMouseScroll',mouseScale);
        self.addEvent(opt.ele,'gesturestart',gestureStart);
        self.addEvent(opt.ele,'gestureend',gestureEnd);

        s360.autoPlay(defaults.autoPlay);
        // 事件过程体

        function mouseDown(e){
            e.preventDefault();
            clearTimeout(opt.autoPlayTime);
            eleX = -1;
            range = 0;
            clearTimeout(opt.easeTime);
            opt.moveLock = false;
            if(!opt.gesture.gestured){
                opt.gesture.touchList[0].pageX = e.pageX;
                opt.gesture.touchList[0].pageY = e.pageY;
            }
        }
        function mouseUp(e){
            e.preventDefault();
            if(!opt.moveLock){
                s360.easeStop(1,function(){
                    s360.autoPlay(defaults.autoPlay);
                });
            }
            opt.moveLock = true;
        }
        function getElementMouseCoords(e,ele){
            var w = ele.clientWidth,
                h = ele.clientHeight,
                x = e.pageX,
                y = e.pageY,
                ot = ele.offsetTop,
                ol = ele.offsetLeft,
                r = {x:0,y:0};
            r.x = (x - ol) < 0 ? 0 : (x - ol) > w ? w : x - ol;
            r.y = (y - ot) < 0 ? 0 : (y - ot) > h ? h : y - ot;
            return r;
        }
        function mouseMove(e){
            e.preventDefault();
            var coords = {
                x : e.pageX,
                y : e.pageY
            };
            if(!opt.moveLock){
                if(typeof e.touches != 'undefined'){
                    coords.x = e.touches[0].pageX;
                }
                if(eleX == -1){
                    eleX = coords.x;
                    return;
                }
                range = parseInt((coords.x - eleX) / defaults.sensibility);
                s360.turnRotate(range);
                eleX = coords.x;
            }else{
                coords = self.getElementMouseCoords(e,opt.ele_ol);
                if(typeof e.touches == 'undefined'){
                    var ox = parseInt((coords.x/opt.ele.clientWidth*opt.gesture.scale)*100)+'%',
                        oy = parseInt((coords.y/opt.ele.clientHeight*opt.gesture.scale)*100)+'%';
                    opt.ele_ol.style.transformOrigin = ox+" "+oy;
                }
            }
        }
        function mouseScale(e){
            var m = parseInt(defaults.maxScale);
            if(!!e.scale){
                // 两手指触发
                opt.moveLock = true;
                if(Math.abs(e.scale - opt.gesture.scale)>0.01){
                    if((e.scale - opt.gesture.scale)>1 ){
                        opt.scale += e.scale-1;
                    }else{
                        opt.scale -= opt.gesture.scale-e.scale;
                    }
                    opt.gesture.scale = e.scale;
                }
            }if(typeof e.wheelDelta == 'undefined') {
                // 滚轮触发
                if(e.detail==3){
                    opt.scale+=0.1;
                }else{
                    opt.scale-=0.1;
                }
            }else{
                // 滚轮触发
                if(e.wheelDelta<0){
                    opt.scale+=0.1;
                }else{
                    opt.scale-=0.1;
                }
            }
            if(opt.scale>m){
                opt.scale = m;
            }
            if(opt.scale<1){
                opt.scale = 1;
            }
            opt.ele_ol.style.webkitTransform = 'scale('+opt.scale+') '+'translate('+opt.gesture.x+'%,'+opt.gesture.y+'%)';
            opt.ele_ol.style.transform = 'scale('+opt.scale+') '+'translate('+opt.gesture.x+'%,'+opt.gesture.y+'%)';
        }
        // 多点触摸
        function gestureStart(e){
            // 每次
            opt.gesture.scale = 1;
            opt.gesture.gestured = true;
            var tl = opt.gesture.touchList;
            tl[1].pageX = e.pageX;
            tl[1].pageY = e.pageY;
            var ox = ((tl[0].pageX-(tl[0].pageX-tl[1].pageX)/ 2) /opt.ele.clientWidth)*100,
                oy = ((tl[0].pageY-(tl[0].pageY-tl[1].pageY)/ 2) /opt.ele.clientHeight)*100;

            opt.gesture.x -= (opt.gesture.ox-ox)*(opt.scale-1)/opt.scale;
            opt.gesture.y -= (opt.gesture.oy-oy)*(opt.scale-1)/opt.scale;
            if(opt.scale == 1){
                opt.gesture.x = 0;
                opt.gesture.y = 0;
            }
            opt.ele_ol.style.transformOrigin = ox+"% "+ oy+"%";
            opt.ele_ol.style.transform = 'scale('+opt.scale+') '+'translate('+opt.gesture.x+'%,'+opt.gesture.y+'%)';
            //document.getElementById('debug').innerText = opt.ele.clientWidth+'||'+parseInt(opt.scale*100) + '||' + parseInt(opt.gesture.x) + '||' + parseInt(opt.gesture.ox) + '||' + parseInt(ox);
            //document.getElementById('debugY').innerText = opt.ele.clientHeight+'||'+parseInt(opt.scale*100) + '||' + parseInt(opt.gesture.y) + '||' + parseInt(opt.gesture.oy) + '||' + parseInt(oy);

            opt.gesture.ox = ox;
            opt.gesture.oy = oy;
        }
        function gestureEnd(e){
            opt.gesture.gestured = false;
        }

        // 渲染组件Html结构
        function _renderList(){
            var list = document.createElement('ol');
            list.setAttribute('style','position:absolute; top:0; left:0; visibility:hidden; width: '+defaults.width+'; height: '+defaults.height+'; transition: all .1s; -webkit-transition: all .1s ease-out;');
            for(var i = 1; i<=opt.imgTotal; i++){
                var li = document.createElement('li');
                var visibility = 'visibility: hidden;';
                if(i == defaults.startIndex){
                    visibility = '';
                }
                li.setAttribute('style','position:absolute; left:0; top:0; width:100%; height:100%;'+visibility);
                var img = new Image();
                img.src = defaults.imgPath + defaults.imgPrefix + self.reserveNumber(defaults.reserveNumberLength,i) + '.' + defaults.imgType;
                img.setAttribute('style','width:100%;');
                li.appendChild(img);
                imgLoadState.imgArr.push(img);
                list.appendChild(li);
            }
            opt.ele_ol = list;
            opt.ele.appendChild(list);
            _imgLoading();
        }
        // 图片加载
        function _imgLoading(){
            imgLoadState.imgComplete = 0;
            for(var i = 0; i<opt.imgTotal; i++){
                if(imgLoadState.imgArr[i].complete){
                    imgLoadState.imgComplete++;
                }
            }
            imgLoadState.loadProgress = parseInt(imgLoadState.imgComplete / opt.imgTotal * 100);
            if(typeof defaults.loadProcess == 'function'){
                defaults.loadProcess.call(s360,imgLoadState.loadProgress);
            }
            if(imgLoadState.imgComplete !== opt.imgTotal){
                setTimeout(_imgLoading,100);
            }else{
                opt.ele_ol.style.visibility = 'visible';
                if(typeof defaults.loadProcess == 'function'){
                    defaults.loadComplete.call(s360);
                }
            }
        }
    }
    BigEye.prototype.show360 = function(options){
        return new Show360(options);
    };
    // 注册事件
    BigEye.prototype.addEvent = function(ele,name,handle){
        var self = this;
        if(typeof ele.nodeType == 'undefined'){
            console.warn('操作的不是一个Node');
        }
        if(self.platform()){
            switch(name){
                case 'mousedown':
                    name = 'touchstart';
                    break;
                case 'mouseup':
                    name = 'touchend';
                    break;
                case 'mousemove':
                    name = 'touchmove';
                    break;;
                case 'mousewheel':
                    name = 'gesturechange';
                    if(document.hasOwnProperty())
                        break;
            }
        }
        ele.addEventListener(name,handle,false);
        return ele;
    };
    // 删除事件
    BigEye.prototype.removeEvent = function(ele,name,handle){
        var self = this;
        if(typeof ele.nodeType == 'undefined'){
            console.warn('操作的不是一个Node');
        }
        ele.removeEventListener(name,handle,false);
        return ele;
    };
    // 数据类型判断
    BigEye.prototype.typeOf = function(val){
        var type = typeof val;
        if(typeof val != 'object'){
            return type;
        }else{
            return val == null ? 'null' : Object.prototype.toString.call(val).slice(8,-1).toLowerCase();
        }
    };
    // 继承方法，支持深度继承
    BigEye.prototype.extend = function(flag){
        var self = this;
        var start = 0;
        if(typeof flag === 'boolean' && flag){
            start = 1;
        }
        if(self.typeOf(arguments[start]) === 'object' || self.typeOf(arguments[start]) === 'array'){
            //var arr = arguments.slice(start+1,-1);
            for(var i = start+1; i<arguments.length; i++){
                if(self.typeOf(arguments[i]) === 'object' || self.typeOf(arguments[i]) === 'array'){
                    for(var key in arguments[i]){
                        if(start === 1){
                            if(self.typeOf(arguments[i][key]) === 'object' || self.typeOf(arguments[i][key]) === 'array'){
                                //arguments.callee(flag,arguments[1][key],arr[i][key]); 严格模式禁用了callee
                                if(arguments[start][key] == undefined){
                                    self.typeOf(arguments[i][key]) === 'object' ? arguments[start][key] = {} :  arguments[start][key] = [];
                                }
                                self.extend(true,arguments[start][key],arguments[i][key]);
                            }else{
                                arguments[start][key] = arguments[i][key];
                            }
                        }else{
                            arguments[start][key] = arguments[i][key];
                        }
                    }
                }
            }
        }

    };
    // 设备判断(简)
    BigEye.prototype.platform = function(){
        return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
    };
    // 保留位计算
    BigEye.prototype.reserveNumber = function(l,n){
        var num = n + '',
            c = l - num.length;
        for(var i = 0; i < c; i++){
            num = '0' + num;
        }
        return num;
    };
    // 元素内坐标计算
    BigEye.prototype.getElementMouseCoords = function(e,ele){
        var o = ele,
            t = 0,
            l = 0;
        while(o.tagName != 'BODY'){
            t += o.offsetTop;
            l += o.offsetLeft;
            o = o.offsetParent;
        }
        var w = ele.clientWidth,
            h = ele.clientHeight,
            x = e.pageX,
            y = e.pageY,
            ot = t,
            ol = l,
            r = {x:0,y:0};
        r.x = (x - ol) < 0 ? 0 : (x - ol) > w ? w : x - ol;
        r.y = (y - ot) < 0 ? 0 : (y - ot) > h ? h : y - ot;
        return r;
    };
    // 缓动方法
    BigEye.prototype.tween = (function(){
        return {
            Linear: function(t,b,c,d){ return c*t/d + b; },
            Quad: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * (( t)*(t-2) - 1) + b;
                }
            },
            Cubic: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                }
            },
            Quart: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                }
            },
            Quint: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                }
            },
            Sine: {
                easeIn: function(t,b,c,d){
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOut: function(t,b,c,d){
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                }
            },
            Expo: {
                easeIn: function(t,b,c,d){
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOut: function(t,b,c,d){
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 *  t) + 2) + b;
                }
            },
            Circ: {
                easeIn: function(t,b,c,d){
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                }
            },
            Elastic: {
                easeIn: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOut: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
                },
                easeInOut: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                }
            },
            Back: {
                easeIn: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                }
            },
            Bounce: {
                easeIn: function(t,b,c,d){
                    return c - tween.Bounce.easeOut(d-t, 0, c, d) + b;
                },
                easeOut: function(t,b,c,d){
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                easeInOut: function(t,b,c,d){
                    if (t < d/2) return tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
                    else return tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            }
        };
    })();
})(window);
