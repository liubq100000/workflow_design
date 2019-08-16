(function($){
var myflow = $.myflow;

$.extend(true,myflow.config.rect,{
	attr : {
	r : 8,
	fill : '#F6F7FF',
	stroke : '#03689A',
	"stroke-width" : 2
}
});
//流程
$.extend(true,myflow.config.props.props,{
	code : {name:'code', label:'编码', value:'', editor:function(){return new myflow.editors.inputEditor();}},
	name : {name:'name', label:'名称', value:'流程'+(new Date().getTime()), editor:function(){return new myflow.editors.inputEditor();}},	
	desc : {name:'desc', label:'描述', value:'', editor:function(){return new myflow.editors.inputEditor();}}
});

//节点
$.extend(true,myflow.config.tools.states,{
	start : {
		showType: 'image',
		ID:'start123',
		type : 'start',
		name : {text:'<<start>>'},
		text : {text:'开始'},
		img : {src : getRootPath()+'/img/48/start_event_empty.png',width : 48, height:48},
		attr : {width:50 ,heigth:50 },
		props : {
			text: {name:'text',label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'开始'}
		}},
	end : {showType: 'image',type : 'end',
		name : {text:'<<end>>'},
		text : {text:'结束'},
		img : {src : getRootPath()+'/img/48/end_event_terminate.png',width : 48, height:48},
		attr : {width:50 ,heigth:50 },
		props : {
			text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'结束'}
		}},
	'end-cancel' : {showType: 'image',type : 'end-cancel',
		name : {text:'<<end-cancel>>'},
		text : {text:'取消'},
		img : {src : getRootPath()+'/img/48/end_event_cancel.png',width : 48, height:48},
		attr : {width:50 ,heigth:50 },
		props : {
			text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'取消'}
		}},
	'end-error' : {showType: 'image',type : 'end-error',
		name : {text:'<<end-error>>'},
		text : {text:'错误'},
		img : {src : getRootPath()+'/img/48/end_event_error.png',width : 48, height:48},
		attr : {width:50 ,heigth:50 },
		props : {
			text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'错误'}
		}},
	state : {showType: 'text',type : 'state',
		name : {text:'<<state>>'},
		text : {text:'状态'},
		img : {src : getRootPath()+'/img/48/task_empty.png',width : 48, height:48},
		props : {
			code: {name:'code', label: '编码', value:'', editor: function(){return new myflow.editors.inputEditor();}},
			text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'状态'}			
		}},
	fork : {showType: 'image',type : 'fork',
		name : {text:'<<fork>>'},
		text : {text:'分支'},
		img : {src : getRootPath()+'/img/48/gateway_parallel.png',width :48, height:48},
		attr : {width:50 ,heigth:50 },
		props : {
			code: {name:'code', label: '编码', value:'', editor: function(){return new myflow.editors.inputEditor();}},
			text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'分支'}
		}},
	join : {showType: 'image',type : 'join',
		name : {text:'<<join>>'},
		text : {text:'合并'},
		img : {src : getRootPath()+'/img/48/gateway_parallel.png',width :48, height:48},
		attr : {width:50 ,heigth:50 },
		props : {
			code: {name:'code', label: '编码', value:'', editor: function(){return new myflow.editors.inputEditor();}},
			text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'合并'}
		}},
	task : {showType: 'text',type : 'task',
		name : {text:'<<task>>'},
		text : {text:'任务'},
		img : {src : getRootPath()+'/img/48/task_empty.png',width :48, height:48},
		props : {
			code: {name:'code', label: '编码', value:'', editor: function(){return new myflow.editors.inputEditor();}},
			text: {name:'text', label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'任务'}
		}}
});


//连接线
$.extend(true,myflow.config.tools.path,{		
	props : {		
		code: {name:'code',label: '编码', value:'', editor: function(){return new myflow.editors.inputEditor();}},
		text: {name:'text',label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}}
	}
});
$.extend(true,myflow.config.path,{		
	props : {		
		code: {name:'code',label: '编码', value:'', editor: function(){return new myflow.editors.inputEditor();}},
		text: {name:'text',label: '显示', value:'', editor: function(){return new myflow.editors.textEditor();}}
	}
});

})(jQuery);