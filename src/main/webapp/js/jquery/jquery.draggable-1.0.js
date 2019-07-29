/**
 * 拖动改变DOM元素位置插件
 * 使用GPL Licensed: http://www.gnu.org/licenses/gpl.txt
 * @author yangsong
 * @since 2014/03/28
 */
(function($){
    //预存移动变量方法
    function drag(e){
        var opts = $.data(e.data.target, 'draggable').options;
        //中间变量
        var dragData = e.data;
        //拖动后的left=原先的left+拖动位移
        var left = dragData.startLeft + e.pageX - dragData.startX;
        var top = dragData.startTop + e.pageY - dragData.startY;

        if (opts.deltaX != null && opts.deltaX != undefined){
            left = e.pageX + opts.deltaX;//如果有点击位移，左坐标直接等于鼠标位置+偏移
        }
        if (opts.deltaY != null && opts.deltaY != undefined){
            top = e.pageY + opts.deltaY;
        }
        //如果拖动对象有父对象，对于计算出来的left和top要加上父对象的left和top
        if (e.data.parnet != document.body) {
            if ($.boxModel == true) {//只针对盒子模型进行设置
                left += $(e.data.parent).scrollLeft();
                top += $(e.data.parent).scrollTop();
            }
        }

        if (opts.axis == 'h') {//如果是水平拖动 则只改left
            dragData.left = left;
        } else if (opts.axis == 'v') {//如果是垂直，则只改top
            dragData.top = top;
        } else {
            dragData.left = left;
            dragData.top = top;
        }
    }
    //实现位移变化的函数
    function applyDrag(e){
        var opts = $.data(e.data.target, 'draggable').options;
        var proxy = $.data(e.data.target, 'draggable').proxy;//获取拖动对象的proxy对象,proxy就是我们在拖动时候随鼠标移动的对象
        if (proxy){
            proxy.css('cursor', opts.cursor);
        } else {
            proxy = $(e.data.target);
            $.data(e.data.target, 'draggable').handle.css('cursor', opts.cursor);
        }
        proxy.css({//最主要方法，该方法使得对象被拖动
            left:e.data.left,
            top:e.data.top
        });
    }
    //3按下鼠标时候执行的方法
    function doDown(e){
        var opts = $.data(e.data.target, 'draggable').options;//获取拖动对象中option配置信息
        //拖和放是对应的，现在来设置放对象
        var droppables = $('.droppable').filter(function(){//如果放对象和托对象是一个对象，则不拖动
            return e.data.target != this;
        }).filter(function(){//如何不是同一个对象
            var accept = $.data(this, 'droppable').options.accept;
            if (accept){//如果目标地设置了接收对象，则只有符合接收条件的对象才能被拖进来
                return $(accept).filter(function(){
                    return this == e.data.target;
                }).length > 0; //只要有一个匹配就ok了
            } else {
                return true; //如果目标地，没设置接受对象，则所有对象都可以被拖进来。
            }
        });
        $.data(e.data.target, 'draggable').droppables = droppables;

        var proxy = $.data(e.data.target, 'draggable').proxy;//获取拖动对象的proxy对象,proxy就是我们在拖动时候随鼠标移动的对象
        if (!proxy){//如果没有专门配置一个proxy
            var curElement = $(e.data.target);
            if (opts.proxy){//看看option中是否有proxy,如果有
                if (opts.proxy == 'clone'){//proxy为'clone'
                    proxy = curElement.clone();//复制当前dom,并查到当前dom后面
                    curElement.after(proxy);
                }else if (opts.proxy == 'ghost'){
                    proxy = curElement.clone();
                    curElement.after(proxy);
                    proxy.css({
                        "border-width":"1px",
                        "border-style":"dashed",
                        "background":"none",
                        "width":curElement.width(),
                        "height":curElement.height()
                    });
                    proxy.empty();
                } else {
                    proxy = opts.proxy.call(e.data.target, e.data.target);//如果为一个函数，则调用这个函数返回值
                }
                $.data(e.data.target, 'draggable').proxy = proxy;//同事把opts.里面的proxy协会到拖动对象的draggable缓存配置里面去。
            } else {//如果哪里都没有的话
                proxy = $(e.data.target);//proxy对象就是本身了
            }
        }

        proxy.css('position', 'absolute');//因为是拖动，所以要absolute
        //开始拖动，改变拖动对象的一些属性值，放在中间变量中
        drag(e);
        //将对象的属性值进行更新，实现拖动效果
        applyDrag(e);
        //调用开始拖动函数
        opts.onStartDrag.call(e.data.target, e);
        return false;
    }
    //移动事件注册方法
    function doMove(e){

        drag(e);
        if ($.data(e.data.target, 'draggable').options.onDrag.call(e.data.target, e) != false){
            applyDrag(e);
        }

        var source = e.data.target;
        $.data(e.data.target, 'draggable').droppables.each(function(){
            var dropObj = $(this);
            var p2 = $(this).offset();
            if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()//判断是否已经拖动到目标区域内
                && e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
                if (!this.entered){ //触发移进事件，并设置移动标志量
                    $(this).trigger('_dragenter', [source]);
                    this.entered = true;
                }
                $(this).trigger('_dragover', [source]);//触发目标对象的over事件
            } else {
                if (this.entered){//否则在判断下是否是从目标对象内移除，并设置标志量
                    $(this).trigger('_dragleave', [source]);
                    this.entered = false;
                }
            }
        });

        return false;
    }

    function doUp(e){
        drag(e);

        var proxy = $.data(e.data.target, 'draggable').proxy;
        var opts = $.data(e.data.target, 'draggable').options;
        if (opts.revert){
            if (checkDrop() == true){//如果进入了目标对象
                removeProxy();
                $(e.data.target).css({
                    position:e.data.startPosition,
                    left:e.data.startLeft,
                    top:e.data.startTop
                });
            } else {
                if (proxy){
                    proxy.animate({
                        left:e.data.startLeft,
                        top:e.data.startTop
                    }, function(){
                        removeProxy();
                    });
                } else {
                    $(e.data.target).animate({
                        left:e.data.startLeft,
                        top:e.data.startTop
                    }, function(){
                        $(e.data.target).css('position', e.data.startPosition);
                    });
                }
            }
        } else {//如果没有reverte设置，直接修改拖动dom的位置即可。
            $(e.data.target).css({
                position:'absolute',
                left:e.data.left,
                top:e.data.top
            });
            removeProxy();//移除proxy对象
            checkDrop();
        }



        opts.onStopDrag.call(e.data.target, e);

        function removeProxy(){
            if (proxy){
                proxy.remove();
            }
            $.data(e.data.target, 'draggable').proxy = null;
        }
        //该方法检验是否将对象拖动到目标对象内，如果拖动进去了，触发目标对象的_drop事件，并设置进入标志。
        function checkDrop(){
            var dropped = false;
            //对drop对象进行遍历操作
            $.data(e.data.target, 'draggable').droppables.each(function(){
                var dropObj = $(this);
                var p2 = $(this).offset();
                if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()//如果移进了一个目标对象
                    && e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
                    if (opts.revert){//如果revert是true,就会还原
                        $(e.data.target).css({
                            position:e.data.startPosition,
                            left:e.data.startLeft,
                            top:e.data.startTop
                        });
                    }
                    $(this).trigger('_drop', [e.data.target]);
                    dropped = true;
                    this.entered = false;
                }
            });
            return dropped;
        }

        $(document).unbind('.draggable');//接触document上的事件，否则移动结束后，元素还是会变位置的
        return false;
    }
    //1，注册draggable方法到$()上
    $.fn.draggable = function(options){
        if (typeof options == 'string'){//option为字符串的时候，进行处理
            switch(options){
                case 'options':
                    return $.data(this[0], 'draggable').options;//为option,实际是获取,该对象缓存数据中名为draggable中的options对象,可以参考jquery $data()方法
                case 'proxy':
                    return $.data(this[0], 'draggable').proxy;//获取缓存中的proxy
                case 'enable'://执行禁止拖动操作。
                    return this.each(function(){
                        $(this).draggable({disabled:false});
                    });
                case 'disable'://允许拖动
                    return this.each(function(){
                        $(this).draggable({disabled:true});
                    });
            }
        }

        return this.each(function(){	//通过调用$().draggable()方法来实现拖动
//			$(this).css('position','absolute');
            var opts;
            var state = $.data(this, 'draggable');//获取对象上在缓存中存放的draggable对象，首次肯定为空
            if (state) {
                state.handle.unbind('.draggable');
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, $.fn.draggable.defaults, options || {});//合并配置参数，来源为默认配置+传递进来的参数
            }

            if (opts.disabled == true) {  //如果参数中含有禁止拖动的配置，则返回
                $(this).css('cursor', 'default');
                return;
            }

            var handle = null;    //handle是实际触发拖动的对象
            if (typeof opts.handle == 'undefined' || opts.handle == null){
                handle = $(this);  //handle为空，则默认为调用对象数组中本身的子元素
            } else {
                handle = (typeof opts.handle == 'string' ? $(opts.handle, this) : opts.handle);//如果为字符串，包装成本身jquery对象和本身两个对象。
            }
            $.data(this, 'draggable', {  //把opts信息更新到子元素的缓存中的draggable对象中
                options: opts,
                handle: handle
            });

            // bind mouse event using event namespace draggable
            handle.bind('mousedown.draggable', {target:this}, onMouseDown); //注册拖动对象的mousedown事件，后面的.draggable是为事件注册一个命名空间，好处是unbind(.draggable)=unbind(.mousedown)+unbind(.mouseover)
            handle.bind('mousemove.draggable', {target:this}, onMouseMove);//注册鼠标滑动事件  //注意this代表的是$()元素中的每一个子dom元素

            function onMouseDown(e) {
                if (checkArea(e) == false) return;

                var position = $(e.data.target).position();//获取被拖动元素的top 和left
                var data = {  //封装data 对象，记录width,height,pageX,pageY,left 和top是为了方便计算拖动后的位置
                    startPosition: $(e.data.target).css('position'), //absolute  or relative or active
                    startLeft: position.left,
                    startTop: position.top,
                    left: position.left,
                    top: position.top,
                    startX: e.pageX, //鼠标点击时的x坐标
                    startY: e.pageY, //鼠标点击时的y坐标
                    target: e.data.target, //子dom
                    parent: $(e.data.target).parent()[0] //拖动对象的父dom
                };

                $(document).bind('mousedown.draggable', data, doDown); //在document上绑定三个鼠标事件。根据事件的下传特性，当在目标对象上执行drap.就会触发document上的drap.
                $(document).bind('mousemove.draggable', data, doMove); //以下主要分析doDown,doMove 和doUp的实现过程
                $(document).bind('mouseup.draggable', data, doUp);
            }

            function onMouseMove(e) {  //move事件主要是当鼠标移动到可以拖拽元素上，鼠标形状进行改变
                if (checkArea(e)){
                    $(this).css('cursor', opts.cursor);
                } else {
                    $(this).css('cursor', 'default');
                }
            }

            // check if the handle can be dragged  判断鼠标拖动点，离handle的四面八方是否小于设置的adge,如果有一边小于则不拖动
            function checkArea(e) {
                var offset = $(handle).offset();
                var width = $(handle).outerWidth();
                var height = $(handle).outerHeight();
                var t = e.pageY - offset.top;
                var r = offset.left + width - e.pageX;
                var b = offset.top + height - e.pageY;
                var l = e.pageX - offset.left;

                return Math.min(t,r,b,l) > opts.edge;
            }

        });
    };

    $.fn.draggable.defaults = {  //2默认配置信息
        proxy:null,
        revert:false,//该属性是设置拖动后自动还原效果
        cursor:'move',
        deltaX:null,//鼠标点击拖动对象时候，proxy的位移，称作德尔塔
        deltaY:null,
        handle: null,
        disabled: false,
        edge:0,
        axis:null,	// v or h  水平还是垂直方向拖动

        onStartDrag: function(e){},
        onDrag: function(e){},
        onStopDrag: function(e){}
    };
})(jQuery);