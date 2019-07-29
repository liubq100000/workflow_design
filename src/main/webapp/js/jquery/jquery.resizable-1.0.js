/**
 * 拖动改变DOM元素大小的插件
 * 使用GPL Licensed: http://www.gnu.org/licenses/gpl.txt
 * @author yangsong
 * @since 2014/03/28
 * @param $
 */
(function($){
    $.extend($.fn, {
        getCss: function(key) {
            var v = parseInt(this.css(key));
            if (isNaN(v)) return false;
            return v;
        }
    });
    /**
     * 插件入口
     */
    $.fn.resizable = function(opts) {
        /* 初始化参数 */
        var options = $.extend({
            handler: null,
            context : $(document),
            ghost : false,
            min: { width: 100, height: 40 },
            max: { width: $(document).width(), height: $(document).height() },
            onResize: function() {},
            onStop: function() {}
        }, opts);

        var resize = {};
        /* 改变大小事件 */
        resize.resize = function(e) {
            var resizeData = e.data.resizeData;

            var w = Math.min(Math.max(e.pageX - resizeData.offLeft + resizeData.width, resizeData.min.width), options.max.width);
            var h = Math.min(Math.max(e.pageY - resizeData.offTop + resizeData.height, resizeData.min.height), options.max.height);
            resizeData.target.css({
                width: w,
                height: h
            });
            resizeData.onResize(e);
        };
        /* 停止改变大小事件 */
        resize.stop = function(e) {
            //回调事件
            e.data.resizeData.onStop(e);
            //允许文字被选中
            document.body.onselectstart = function() { return true; };
            e.data.resizeData.target.css('-moz-user-select', '');
            //解除事件绑定
            options.context.unbind('mousemove', resize.resize);
            options.context.unbind('mouseup', resize.stop);
        };

        /* 执行元素初始化，绑定事件等操作 */
        return this.each(function() {
            var me = this;
            var handler = null;
            if (typeof options.handler == 'undefined' || options.handler == null){
                handler = $(me);
            }else{
                handler = (typeof options.handler == 'string' ? $(options.handler, this) : options.handle);
            }
            handler.bind('mousedown', { e: me }, function(s) {
                var target = $(s.data.e);
                var resizeData = {
                    width: target.width() || target.getCss('width'),
                    height: target.height() || target.getCss('height'),
                    offLeft: s.pageX,
                    offTop: s.pageY,
                    onResize: options.onResize,
                    onStop: options.onStop,
                    target: target,
                    min: options.min,
                    max: options.max
                };
                //不允许文字被选中
                document.body.onselectstart = function() { return false; };
                target.css('-moz-user-select', 'none');
                //事件绑定
                options.context.bind('mousemove', { resizeData: resizeData }, resize.resize);
                options.context.bind('mouseup', { resizeData: resizeData }, resize.stop);
            });
        });
    };
})(jQuery);
