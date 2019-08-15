(function($){
var myflow = $.myflow;

$.extend(true, myflow.editors, {
	extendEditor: function () {
		var _props, _k, _div, _src, _r;
		this.init = function (props, k, div, src, r,type) {
			_props = props; _k = k; _div = div; _src = src; _r = r,_nowType = type;
			var newInputId=src.getId();
			newInputId+="_"+k;
			var ahtml = "<a href=\"#\" style=\"text-decoration:none;color:#067df7;font-size: 11px;\" />";
			$(ahtml).html("<<更多信息>>").click(function () {
				myflow.config.tools.moreInfo(_nowType,myflow.config.props.props,props);
			}).appendTo('#' + _div);
			$('#' + _div).data('editor', this);
		};
		this.destroy = function () {			
		};
	},
	textEditor: function () {		
		var _props, _k, _div, _src, _r;
		this.init = function (props, k, div, src, r) {			
			_props = props; _k = k; _div = div; _src = src; _r = r;
			var newInputId=src.getId();
			newInputId+="_"+k;
			$('<input style="width:100%;" id="'+newInputId+'"/>').val(props[_k].value).change(
				function () {					
					props[_k].value = $(this).val();
					$(_r).trigger('textchange', [$(this).val(), _src]);
				}).appendTo('#' + _div);
			// $('body').append('aaaa');

			$('#' + _div).data('editor', this);
		};
		this.destroy = function () {
			$('#' + _div + ' input').each(function () {
				_props[_k].value = $(this).val();
				$(_r).trigger('textchange', [$(this).val(), _src]);
			});
			// $('body').append('destroy.');
		};
	},
	inputEditor : function(){
		var _props,_k,_div,_src,_r;
		this.init = function(props, k, div, src, r){
			_props=props; _k=k; _div=div; _src=src; _r=r;			
			var newInputId=src.getId();
			newInputId+="_"+k;
			var nowValue=props[_k].value;
			if(_k=='code'&&nowValue == ''){
				nowValue = _k+"_"+(new Date().getTime());
				props[_k].value = nowValue;
			}
			$('<input style="width:100%;" id="'+newInputId+'"/>').val(props[_k].value).change(function(){
				props[_k].value = $(this).val();				
			}).appendTo('#'+_div);
			
			$('#'+_div).data('editor', this);
		}
		this.destroy = function(){
			$('#'+_div+' input').each(function(){
				_props[_k].value = $(this).val();
			});
		}
	},
	selectEditor : function(arg){
		var _props,_k,_div,_src,_r;
		this.init = function(props, k, div, src, r){
			_props=props; _k=k; _div=div; _src=src; _r=r;
			var newSelectId=src.getId();
			newSelectId+="_"+k
			var sle = $('<select  style="width:100%;" id="'+newSelectId+'"/>').val(props[_k].value).change(function(){
				props[_k].value = $(this).val();
			}).appendTo('#'+_div);
			
			if(typeof arg === 'string'){
				$.ajax({
				   type: "GET",
				   url: arg,
				   success: function(data){
					  var opts = eval(data);
					 if(opts && opts.length){
						sle.append('<option value="">--</option>');
						for(var idx=0; idx<opts.length; idx++){
							sle.append('<option value="'+opts[idx].value+'">'+opts[idx].name+'</option>');
						}
						sle.val(_props[_k].value);
					 }
				   }
				});
			}else {
				sle.append('<option value="">--</option>');
				for(var idx=0; idx<arg.length; idx++){
					sle.append('<option value="'+arg[idx].value+'">'+arg[idx].name+'</option>');
				}
				sle.val(_props[_k].value);
			}
			
			$('#'+_div).data('editor', this);
		};
		this.destroy = function(){
			$('#'+_div+' input').each(function(){
				_props[_k].value = $(this).val();
			});
		};
	}
});

})(jQuery);