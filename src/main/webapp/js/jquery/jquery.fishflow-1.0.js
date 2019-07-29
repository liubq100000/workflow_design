/**
 * fishflow核心插件
 * 使用GPL Licensed: http://www.gnu.org/licenses/gpl.txt
 * @author yangsong
 * @since 2014/03/28
 * @param $
 */
function fishflow(opts){
    //初始化容器及一些变量
    var context = this;
    var defaults={
        title:"fishflow",
        renderTo:$("body"),
        data:{},
        width:900,
        height:500,
        toolBox:["pointer","direct","line","task","node","complex","line","start","end","line","fork"],
        headerToolBar:{},
        buttonBox:{},
        canvasAutoFixSize:true, //是否根据节点数据，自动适应大小
        editable:false			 //是否可编辑
    };
    var options = $.extend(defaults, opts);  //应用参数

    //从参数初始化的变量
    var renderTo = options.renderTo;
    var renderWidth = options.width;
    var renderHeight = options.height;
    var contextId = renderTo.attr("id")||"dgx01";

    var header = undefined;
    var workWindowHeight = undefined;
    var toolBox = undefined;

    var workWindowWidth = undefined;
    var workWindow = undefined;
    var workStage = undefined;
    var canvas = undefined;
    var showItemDlg = options.showItemDlg;
    var graphData = {nodes:{},lines:{}};			//图形数据，记录节点以及连接线数据
    var newNodeRecord = {idx : 1 , label : "节点_"};	//添加新节点配置信息。配置当前最大索引号，默认标签前缀
    var newLineRecord = {idx : 1 };					//添加新连接线配置信息。配置当前最大索引号

    var selectedElement = null;
    /*========================================================================
                          对外公开方法
     ========================================================================*/

	this.isSplitItem = function(item){
		if(item.id.indexOf("split")>0){
			return true;
		}
		return false;
	}
    /**
     *加载图形数据
     */
    this.loadGraphData = function(data){
        loadNodes(data.nodes);
        loadLinkedLines(data.lines);
    };

    /**
     *返回图形数据
     */
    this.getGraphData = function(){
        return graphData;
    };

    /**
     * 获取选择的元素，可能是节点，也有可能是节点
     */
    this.getSelectedElement = function(){
        return selectedElement;
    };

    /**
     * 设置被选中的元素，可能是节点，也有可能是节点
     */
    this.selectedElement = function(id){
        var node = graphData.nodes[id];
        var line = graphData.lines[id];

        if(node){
            var selectedNode = $("#"+node.id,workStage);
            selectedNodeItem(selectedNode[0]);
        }else if(line){
            var lineObject = $("#"+line.id);
            selectLinkedLine(lineObject[0]);
        }
    };


    /**
     * 删除元素
     */
    this.removeElement = function(id){
        var node = graphData.nodes[id];
        var line = graphData.lines[id];
		
        if(node){
			if(context.isSplitItem(node)){
				return;
			}
			var selectedNode = $("#"+node.id,workStage);
			var lines = getNodeLinkedLines(selectedNode);
			for(var i=0;i<lines.length;i++){
				this.removeRelElementLine(lines[i].id,node.id);
			}
			delete graphData.nodes[id];
			selectedNode.remove();
        }else if(line){
			if(context.isSplitItem(line)){
				return;
			}
            var lineObject = $("#"+line.id);
            delete graphData.lines[id];
            lineObject.remove();
        }
		//取消选择
		unSelectAll();
    };

	/**
     * 删除元素
     */
	this.removeRelElementLine = function(id,delNodeId){
        var line = graphData.lines[id];	
		var node;
		if(delNodeId == line.to){
			node = graphData.nodes[line.from];
		} else {
			node = graphData.nodes[line.to];
		}
		if(context.isSplitItem(node)){
			var selectedNode = $("#"+node.id,workStage);
			var lines = getNodeLinkedLines(selectedNode);
			for(var i=0;i<lines.length;i++){
				if(lines[i].id == id){
					continue;
				}
				this.removeRelElementLine(lines[i].id,node.id);
			}
			delete graphData.nodes[node.id];
			selectedNode.remove();
		}
		var lineObject = $("#"+line.id);
		delete graphData.lines[id];
		lineObject.remove();
    };

    /**
     * 获取所有节点
     */
    this.getAllNodes = function(){
        var nodeList = new Array();
        for(var k in graphData.nodes){
            nodeList.push(graphData.nodes[k]);
        }
        return nodeList;
    };

    /**
     * 获取实际节点ID
     */
    this.getActualNodeId = function(id,decode){
        return getActualNodeId(id,decode);
    };

    /**
     * 获取实际连线ID
     */
    this.getActualLineId = function(id,decode){
        return getActualLineId(id,decode);
    };

    /**
     * 自动适应尺寸
     * @return
     */
    this.canvasAutoFixSize = function(){
        var motn = findMaxOutterNode();
        var maxWidth =  motn[3].offset().left+motn[3].width();
        var maxHeight = motn[2].offset().top+motn[2].height();
        if(maxWidth<workWindowWidth)maxWidth=workWindowWidth;
        if(maxHeight<workWindowHeight)maxHeight=workWindowHeight;

        //修改工作区及画布大小
        workStage.width(maxWidth);
        workStage.height(maxHeight);
        if(isSvg()){
            $(canvas).width(maxWidth);
            $(canvas).height(maxHeight);
        }else{
            canvas.coordsize = maxWidth+","+maxHeight;
            var stageVml = $(".workStage",workStage);
            stageVml.height(maxWidth);
            stageVml.width(maxHeight);
        }
    };

    /*========================================================================
                                       私有方法
      ========================================================================*/
    /**
     *是否使用SVG模式
     */
    function isSvg(){
        //IE6,7,8不支持SVG，使用VML
        if (navigator.userAgent.indexOf("MSIE 8.0")>0
            ||navigator.userAgent.indexOf("MSIE 7.0")>0
            ||navigator.userAgent.indexOf("MSIE 6.0")>0){
            return false;
        }else{
            return true;
        }
    };
    function getSvgMarker(id,color){
        var m=document.createElementNS("http://www.w3.org/2000/svg","marker");
        m.setAttribute("id",id);
        m.setAttribute("viewBox","0 0 6 6");
        m.setAttribute("refX",5);
        m.setAttribute("refY",3);
        m.setAttribute("markerUnits","strokeWidth");
        m.setAttribute("markerWidth",6);
        m.setAttribute("markerHeight",6);
        m.setAttribute("orient","auto");
        var path=document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute("d","M 0 0 L 6 3 L 0 6 z");
        path.setAttribute("fill",color);
        path.setAttribute("stroke-width",0);
        m.appendChild(path);
        return m;
    };

    /**
     *初始化渲染对象的容器样式
     */
    function initRenderTo(renderTo,width,height){
        renderTo.addClass("fishflow");
        renderTo.css({width:width+"px",height:height+"px"});
    };

    /**
     *初始化头部
     */
    function initHeader(renderTo,options){
        //头部代码
        var headerHTML  = "";
        headerHTML += "<div class='header'>";
        headerHTML += 		"<label>"+options.title+"</label>";
        headerHTML +=		"<span></span>";
        headerHTML += "</div>";

        //组装生成头部
        var header = $(headerHTML);

        //工具栏按钮
        for(var k in options.headerToolBar){
            if(k=="line"){
                header.append("<span></span>");
                continue;
            }
            var btnHTML = "<a href='javascript:void(0)' class='toolBtnItem'><b class='ico_"+k+"'></b></a>";
            var btnItem = $(btnHTML);
            btnItem.click(options.headerToolBar[k]);
            header.append(btnItem);
        }
        renderTo.append(header);
        return header;
    };

    /**
     *初始化组件工具箱
     */
    function initComponentToolBox(renderTo,height,btnData){
        //工具箱容器
        var toolBox = $("<div class='toolBox'><div>");
        var buttonBar = $("<div class='buttonBar'></div>");
        buttonBar.css("height",height);
        //两个固定按钮，选择指针和连接线
        for(var i=0;i<options.toolBox.length;i++){
            var tbxItemName = options.toolBox[i];
            if(tbxItemName=="line"){
                buttonBar.append("<span></span>");
                continue;
            }
            var tbxItem = $("<a href='javascript:void(0)' class='btn' id='"+contextId+"_btn_pointer'><b class='ico_"+tbxItemName+"'/></a>");
            if(i==0)tbxItem.addClass("btnDown");
            buttonBar.append(tbxItem);
        }
        //组装生成工具箱
        toolBox.append(buttonBar);
        renderTo.append(toolBox);
        //绑定工具箱一次只能高亮一个按钮
        bindToolBoxSwitch(toolBox);
        //$(".btn:first",buttonBar).click();
        //返回工具箱组件
        return toolBox;
    };

    /**
     *绑定事件，保证只有一个组件工具箱按钮高亮
     */
    function bindToolBoxSwitch(toolBox){
        $("a.btn",toolBox).on("click",function(){
			
            var clickedBtn = $(this);
            var selectedItem = getSelectedToolBoxItem();			
					
            //如果两次点击的为同一对象，则不用处理了
            if(clickedBtn.index()===selectedItem.index())return;		
            //只高亮一个
            selectedItem.removeClass("btnDown");
            clickedBtn.addClass("btnDown");

			//后面加逻辑才是对的
			//分块
			var nowType = getSelectedTBXItemType();	
			if(nowType=="fork"){
				var selectedEle = context.getSelectedElement();
				if(selectedEle&&selectedEle.elementType == 'line'){
					splitLine(graphData.lines[selectedEle.id].jQueryObject[0]);
				}			
			}
            //修改工作区指针样式
            else if(nowType=="direct"){
                workStage.css("cursor","crosshair");
                $("div,td,span",workStage).css("cursor","crosshair");
				unSelectAll();
            }
			//其它
			else{
                workStage.css("cursor","default");
                $("div,td,span",workStage).css("cursor","default");
            }
        });
    };

    /**
     *获取已选择的工具栏按钮项
     */
    function getSelectedToolBoxItem(){
        return $("a.btnDown",toolBox);
    };

    /**
     *获取工具栏组件按钮项的类型
     */
    function getToolBoxItemType(tbxItem){
        var bElement = $("b[class^='ico_']",tbxItem);
        var className = bElement.attr("class");
        if(!className)return;
        var regExp = /\s*ico\_(\w+)\s*/g;
        return regExp.exec(className)[1];
    };

    /**
     *获取组件工具箱已选择项的类型
     */
    function getSelectedTBXItemType(){
        return getToolBoxItemType(getSelectedToolBoxItem());
    }

    /**
     *初始化工作窗口
     */
    function initWorkStage(renderTo,width,height){
        //工作窗口
        workWindow = $("<div class='workWindow' style='overflow: hidden;'></div>");
        workWindow.css({
            "width":width + "px",
            "height":height + "px"
        });
        renderTo.append(workWindow);

        //工作舞台（编辑区）
        workStage = $("<div class='workStage'  ></div>");
        workStage.css({"width":width+"px","height":height+"px"});
        disableSelect();
        workWindow.append(workStage);

        //节点名称编辑器
        var nodeNameEditor = $('<input id="nodeNameEditor"></input>');
        workStage.append(nodeNameEditor);
        nodeNameEditor.blur(function(){
            $(this).hide();
            disableSelect();
        });

        return workStage;
    };

    /**
     * 禁用文字选择
     * @return
     */
    function disableSelect(){
        workStage.attr({"unselectable":"on"
            ,"onselectstart":'return false'
            ,"onselect":'document.selection.empty()'
        });
    };
    /**
     * 启用文字选择
     * @return
     */
    function enableSelect(){
        workStage.attr({"unselectable":"off"
            ,"onselectstart":'return true'
            ,"onselect":''
        });
    };

    /**
     *初始化画布
     */
    function initCanvas(workStage,width,height){
        //生成画布对象，使用SVG，如果为IE6,7,8则使用VML
        var canvas = null;
        if(isSvg()){
            canvas=document.createElementNS("http://www.w3.org/2000/svg","svg");//可创建带有指定命名空间的元素节点
            var defs=document.createElementNS("http://www.w3.org/2000/svg","defs");
            defs.appendChild(getSvgMarker("arrow1","#15428B"));
            defs.appendChild(getSvgMarker("arrow2","#ff3300"));
            defs.appendChild(getSvgMarker("arrow3","#ff3300"));
            canvas.appendChild(defs);
            $(canvas).css({
                "width":width*2+"px"
                ,"height":height*2+"px"
            });
            workStage.prepend(canvas);
        }else{
            canvas = document.createElement("v:group");
            canvas.coordsize = width*2+","+height*2;
            var vml = $("<div class='stageVml'></div>");
            vml.css({
                "width":width*2+"px"
                ,"height":height*2+"px"
                ,"position":"relative"
            });
            vml.append(canvas);
            workStage.prepend(vml);
        }
        if(!canvas)return;
        canvas.id = contextId+"_canvas";

        return canvas;
    };

    /**
     *加载节点信息
     */
    function loadNodes(nodesData){
        for(var i=0;i<nodesData.length;i++){
            addNodeItem(nodesData[i]);
        }
    };
 
    /**
     *加载单个节点项
     */
    function addNodeItem(data){
        var top = data.top;
        var left = data.left;
        var nodeId = getActualNodeId(data.id);
        var node = $('<div class="nodeItem" id="'+nodeId+'"></div>');

        //不为开始或结束节点，那么为普通节点
        if( data.type != "split"){
            var width = data.width? data.width:100;
            if(width<100){
            	width = 100;
            }            
            var height = data.height? data.height:24;
            if(height<24){
            	height = 24;
            }  
            if(top<0)top=0;
            if(left<0)left=0;
            //绘制节点
            node.css({"top":top+"px","left":left+"px"});
            buildNode(data.type,data.name,node,width-2,height-2);
		}else if(data.type == "split"){
			node.addClass("splitRound");
            node.css({"top":top+"px","left":left+"px"});
			buildSplitNode(node);
        }

        //组装并且记录DOM对象及JSON数据
        workStage.append(node);
        data.jQueryObject = node;	//增加一个元素，记录原始jQueryDom对象
        data.elementType  = "node";	//增加一个元素，记录对象元素类型为节点
        graphData.nodes[nodeId]=data;
    };

    /**
     *获取实际的节点号，实际节点号一般等于contextId+id+'_node'
     */
    function getActualNodeId(nodeId,decode){
        return nodeId;
        //作节点号名称控制用起来有一定复杂度，暂时放弃。
        if(decode){
            nodeId = nodeId.replace(contextId+"_","");
            nodeId = nodeId.replace("_node","");
            return nodeId;
        }else{

            return contextId+"_"+nodeId+"_node";
        }
    };

    /**
     *构造开始或结束节点
     */
    function buildStartOrEndNode(type,name,node){
        //节点用表格显示
        var innerTableHTML = '';
        innerTableHTML += '<table cellspacing="0">';
        innerTableHTML +=   '<tr>';
        innerTableHTML +=     '<td class="ico"><b class="ico_'+type+'"></b></td>';
        innerTableHTML +=   '</tr>';
        innerTableHTML += '</table>';
        //节点控制操作柄
        var innerCtlHTML = '';
        innerCtlHTML += '<div class="handle" style="display:none">';
        innerCtlHTML +=   '<div class="rs_close"></div>';
        innerCtlHTML += '</div>';
        innerCtlHTML += '<div class="text">'+name+'</div>';

        node.append(innerTableHTML);
        node.append(innerCtlHTML);

        bindNodeDBLClick(node,true);
    };

	/**
     *构造开始或结束节点
     */
    function buildSplitNode(node){
        //节点用表格显示
        var innerTableHTML = '';
        innerTableHTML += '<table cellspacing="0">';
        innerTableHTML +=   '<tr>';
        innerTableHTML +=     '<td class="ico"><b></b></td>';
        innerTableHTML +=   '</tr>';
        innerTableHTML += '</table>';
        //节点控制操作柄
        var innerCtlHTML = '';
        innerCtlHTML += '<div class="handle" style="display:none">';
        innerCtlHTML +=   '<div></div>';
        innerCtlHTML += '</div>';
        innerCtlHTML += '<div></div>';

        node.append(innerTableHTML);
        node.append(innerCtlHTML);
    };
    /**
     *构造普通节点
     */
    function trimDis(name){
    	if(name&&name.length>5){
    		return name.substring(0, 4) +"...";
    	}
    	return name;
    }
    /**
     *构造普通节点
     */
    function buildNode(type,name,node,width,height){
        //节点用表格显示
        var innerTableHTML = '';
        innerTableHTML += '<table cellspacing="1" style="width:'+width+'px;height:'+height+'px;">';
        innerTableHTML +=   '<tr>';
        innerTableHTML +=     '<td class="ico"><b class="ico_'+type+'"></b></td>';
        innerTableHTML +=     '<td><span  class="text" title=\"'+name+'\">'+trimDis(name)+'<span></td>';
        innerTableHTML +=   '</tr>';
        innerTableHTML += '</table>';
        //节点控制操作柄
        var innerCtlHTML = '';
        innerCtlHTML += '<div class="handle" style="display:none">';
        innerCtlHTML +=   '<div class="rs_bottom"></div>';
        innerCtlHTML +=   '<div class="rs_right"></div>';
        innerCtlHTML +=   '<div class="rs_close"></div>';
        innerCtlHTML += '</div>';


        node.append(innerTableHTML);
        node.append(innerCtlHTML);

        bindNodeDBLClick(node);
    };

    /**
     * 节点双击事件绑定
     * @param node
     * @return
     */
    function bindNodeDBLClick(node,startEnd){
        if(!options.editable)return;
        //节点双击事件
        $(".text",node).dblclick(function(){
        	var obj = graphData.nodes[node[0].id]; 
        	var textPart = $(this);
        	showItemDlg("node",obj,function(resData){
        		 textPart.text(trimDis(resData.name));        		
        		 textPart[0].title = resData.name;
        		 if(resData.code){
        			 graphData.nodes[resData.id].code=resData.code; 
        		 }
        		 if(resData.name){
        			 graphData.nodes[resData.id].name=resData.name; 
        		 }
        		 if(resData.extendData){
        			 graphData.nodes[resData.id].extendData=resData.extendData;
        		 }         		 
        	})
        });
    };

    function bindLineDBLClick(){
        if(!options.editable)return;
        var lineTag = "g";
        if(!isSvg()) lineTag="polyline";
        $(canvas).delegate(lineTag,"dblclick",function(e){
        	 var line = this;
        	 var selectedEle = context.getSelectedElement();
             if(!selectedEle) return;
             //只有中间的分割线可以，其它不可以
             if(context.isSplitItem(selectedEle)){
            	 if(!selectedEle.id.endsWith("_2")){
            		 return;
            	 }
             }
             var obj = graphData.lines[selectedEle.id];        	
         	showItemDlg("line",obj,function(resData){
         		var lineText = line.childNodes[2];
         		lineText.textContent=trimDis(resData.name);
         		lineText.textContent=trimDis(resData.name);
         		if(resData.code){
	       			 graphData.lines[resData.id].code=resData.code; 
	       		 }
	       		 if(resData.name){
	       			 graphData.lines[resData.id].name=resData.name; 
	       		 }
	       		 if(resData.extendData){
	       			 graphData.lines[resData.id].extendData=resData.extendData;
	       		 }
         	})
        });
    };

    /**
     * 光标移动到末尾
     * @param field
     * @return
     */
    function moveCursorEnd(field){
        field.focus();
        var len = field.value.length;
        if(document.selection){
            var sel = field.createTextRange();
            sel.moveStart('character',len);
            sel.collapse();
            sel.select();
        }else if(typeof field.selectionStart == 'number'&&typeof field.selectionEnd == 'number'){
            field.selectionStart = field.selectionEnd = len;
        }
    };

  
    /**
     *加载连接线
     */
    function loadLinkedLines(linesData){
        for(var i=0;i<linesData.length;i++){
            addLinkedLine(linesData[i]);
        }
    };

	/**
     *添加连接线
     */
    function addSplitLine(data){
     
        //画线并且记录
		var axis = [data.fromAxis,data.toAxis];
        var line = drawLinkedLine(data.id,false,data.name,axis);
        canvas.appendChild(line);
        data.elementType  = "line" ;	//增加一个元素，记录对象元素类型为节点
		data.jQueryObject = $(line);
        graphData.lines[data.id]=data;
    };

    /**
     *添加连接线
     */
    function addLinkedLine(data){
        var lineFrom = getActualNodeId(data.from);
        var lineTo   = getActualNodeId(data.to);
        var lineId = getActualLineId(data.id);
        if(lineFrom==lineTo)	return;	//开始点和结束点相同，则是一条无用的线，不需要绘制
        var eFrom = graphData.nodes[lineFrom];
        var eTo   = graphData.nodes[lineTo];
        if(!checkElementExists(data.id,eFrom,data.from))return;
        if(!checkElementExists(data.id,eTo,data.to))return;
        var linePointAxis = nodeComero(eFrom,eTo);

        //画线并且记录
		var axis = [linePointAxis["fromAxis"],linePointAxis["toAxis"]];
        var line = drawLinkedLine(lineId,false,data.name,axis);
        canvas.appendChild(line);
        data.jQueryObject = $(line);	//增加一个元素，记录原始jQueryDom对象
        data.elementType  = "line" ;	//增加一个元素，记录对象元素类型为节点
		data.fromAxis = linePointAxis["fromAxis"];
		data.toAxis = linePointAxis["toAxis"];
        graphData.lines[lineId]=data;
    };

    function getActualLineId(lineId,decode){
        return lineId;
        //作节点号名称控制用起来有一定复杂度，暂时放弃。
        if(decode){
            lineId = lineId.replace(contextId+"_","");
            lineId = lineId.replace("_line$","");
            return lineId;
        }else{
            return contextId+"_"+lineId+"_line";
        }
    };


    /**
     *搜索节点上关联的连接线
     */
    function getNodeLinkedLines(node){
        var nodeId = getActualNodeId(node.attr("id"),true);
        if(!nodeId)return;
        var linesData = [];
        for(var k in graphData.lines){
            var line = graphData.lines[k];
            if(line.from == nodeId || line.to == nodeId){
                linesData.push(line);
            }
        }
        return linesData;
    };

    function checkElementExists(id,element,elementName){
        if(!element){
            try{console.log("连线"+id+"错误，找不节点:"+elementName);}catch(e){};
            return false;
        }
        return true;
    }

    /**
     *节点坐标测量，计算起点，终点的最终可使用的坐标
     */
    function nodeComero(n1,n2){
		var n1Split = context.isSplitItem(n1);
		var n2Split = context.isSplitItem(n2);
        //取x轴的坐标
        var xa1=n1.left;
        var xa2=n1.left+n1.width;
		if(n1Split){
			xa2=n1.left;
		}
        var xz1=n2.left;
        var xz2=n2.left+n2.width;
		if(n2Split){
			xz2=n2.left;
		}
        //取y轴的坐标
        var ya1=n1.top;
        var ya2=n1.top+n1.height;
		if(n1Split){
			ya2=n1.top;
		}
        var yz1=n2.top;
        var yz2=n2.top+n2.height;
		if(n2Split){
			yz2=n2.top;
		}
        var xAxis = axisCompute(xa1,xa2,xz1,xz2);
        var yAxis = axisCompute(ya1,ya2,yz1,yz2);
		
		
		if(n1Split&&n2Split){
			return {"fromAxis":[n1.left,n1.top],"toAxis":[n2.left,n2.top]};
		}else if(n1Split){
			return {"fromAxis":[n1.left,n1.top],"toAxis":[xAxis[1],yAxis[1]]};
		}else if(n2Split){
			return {"fromAxis":[xAxis[0],yAxis[0]],"toAxis":[n2.left,n2.top]};
		}else{
			return {"fromAxis":[xAxis[0],yAxis[0]],"toAxis":[xAxis[1],yAxis[1]]};
		}        
    };

    /**
     *坐标轴单一维度最终取值计算
     */
    function axisCompute(a1,a2,b1,b2){

        var r1 = undefined,r2=undefined;

        if(a1 >= b2){		//情况1.节点a在节点b的右边或上边
            r1=a1;r2=b2;
        }else if(a2 <= b1){	//情况2.节点a在节点b的左边或下边
            r1=a2;r2=b1;
        }else if(a1 <=b1 && a2 >= b1 && a2 <= b2){	//情况3.节点a在节点b的左边且在水平或垂直部分重合
            r1=(a2+b1)/2;r2=r1;//取交叉部分的中点
        }else if(a1 >=b1 && a1 <= b2 && a2 >= b2 ){	//情况4.节点a在节点b的右边且在水平或垂直部分重合
            r1=(a1+b2)/2;r2=r1;//取交叉部分的中点
        }else if(a1 >= b1 && a2 <= b2){		//情况5.节点a被节点b全部覆盖
            r1=(a1+a2)/2;r2=r1;//取交叉部分的中点
        }else if( a1 <= b1 && a2 >= b2){	//情况6.节点a把节点b全部覆盖
            r1=(b1+b2)/2;r2=r1;//取交叉部分的中点
        }
        return [r1,r2];
    };

    /**
     *画线
     */
    function drawLinkedLine(id,tmpLine,name,axis){
        var line = undefined;
		line = document.createElementNS("http://www.w3.org/2000/svg","g");
		var path = document.createElementNS("http://www.w3.org/2000/svg","path");
		var path1=document.createElementNS("http://www.w3.org/2000/svg","path");
		var pathPos = "";
		var pathInfo = "";
		for(var aIndex=0;aIndex<axis.length;aIndex++){
			if(aIndex == 0){
				pathPos += "M "+axis[aIndex][0]+" "+axis[aIndex][1];
				pathInfo += axis[aIndex][0]+","+axis[aIndex][1];
			} else {
				pathPos += " L "+axis[aIndex][0]+" "+axis[aIndex][1];
				pathInfo += "#"+axis[aIndex][0]+","+axis[aIndex][1];
			}
			
		}
		//设置连线属性
		line.setAttribute("id",id);
		line.setAttribute("from",axis[0][0]+","+axis[0][1]);
		line.setAttribute("to",axis[axis.length-1][0]+","+axis[axis.length-1][1]);
		line.setAttribute("pathInfo",pathInfo);
		path.setAttribute("d",pathPos);
		//辅助线，增加连线的可点击区域
		path1.setAttribute("d",pathPos);
		path1.setAttribute("stroke-width",9);
		path1.setAttribute("visibility","hidden");
		path1.setAttribute("fill","none");
		path1.setAttribute("stroke","white");
		path1.setAttribute("pointer-events","stroke");

		line.appendChild(path1);
		line.appendChild(path);

		var text=document.createElementNS("http://www.w3.org/2000/svg","text");
		line.appendChild(text);
		var mid = (axis.length/2);
		var x0=parseInt(axis[mid-1][0]);
		var y0=parseInt(axis[mid-1][1]);
		var x=((parseInt(axis[mid][0]) - parseInt(axis[mid-1][0]))/2);
		var y=((parseInt(axis[mid][1]) - parseInt(axis[mid-1][1]))/2);
		y -= 5;
		x -= 10;
		text.setAttribute("text-anchor","middle");
		text.setAttribute("x",(x0+x));
		text.setAttribute("y",(y0+y));
		text.style.cursor="text";
		if(name){
			text.textContent = name;
        }
        if(tmpLine){
			setLinkedLineDash(line);
        }else {
			setLinkedLineNormal(line);
		}
        return line;
    };

    /**
     *绑定选中对象
     */
    function bindSelectedItem(){
        $(workStage).delegate(".nodeItem","click",function(e){
			if(getSelectedTBXItemType() == "direct") return;			
            selectedNodeItem(this);
        });
        var lineTag = "g";
        if(!isSvg()) lineTag="polyline";
        $(canvas).delegate(lineTag,"click",function(e){
			if(getSelectedTBXItemType() == "direct") return;			
			selectLinkedLine(this);
        });
    };

    /**
     *取消所有的选择项
     */
    function unSelectAll(){
        $(".selectedNode .handle",workStage).hide();//隐藏节点操作柄       
        $(".selectedNode",workStage).removeClass("selectedNode");//删除选中的样式
        $(".selectedNode",workStage).draggable({"disabled":true});
		 $(".ico",workStage).css("cursor","default");
        selectedElement = null;
        //取消被选中的线
        var lineTag = "g";
        if(!isSvg()) lineTag="polyline";
        $(lineTag,workStage).each(function(){
            setLinkedLineNormal(this);
        });

    };

    /**
     * 把连接线设置上正常模式（不高亮）
     * @param line
     * @return
     */
    function setLinkedLineNormal(line){
        if(isSvg()){
            var path = line.childNodes[1];
            //SVG 标签g下，有两个path标签
            path.setAttribute("stroke-width",1.5);
            path.setAttribute("stroke-linecap","round");
            path.setAttribute("fill","none");
            path.setAttribute("stroke","#5068AE");
            path.setAttribute("marker-end","url(#arrow1)");
            //只有可编辑时，才显示指针为手形
            if(options.editable)path.setAttribute("cursor","pointer");
        }else{
            line.strokeWeight="1.2";
            line.stroke.EndArrow="Block";
            line.strokeColor="#5068AE";
            //只有可编辑时，才显示指针为手形
            if(options.editable)line.style.cursor="pointer";
        }
    };

    

   /**
     * 设置连接线选择
     * @param line
     * @return
     */
    function splitLine(line){
		//已经分割的不能再分割
		if(context.isSplitItem(line)){
			return;
		}
		//路径
		var pathInfo = line.getAttribute("pathInfo");
		var axisPosArr = pathInfo.split("#");
		var axis = [];
		for(var ai=0;ai<axisPosArr.length;ai++){
			var temp = axisPosArr[ai].split(",");
			axis[axis.length] = [parseInt(temp[0]),parseInt(temp[1])];
		}
		var fromx =  parseInt(axis[0][0]);
		var fromy =  parseInt(axis[0][1]);
		var tox =  parseInt(axis[axis.length-1][0]);
		var toy =  parseInt(axis[axis.length-1][1]);
		var x1 = 0;
		var y1 = 0;
		var x2 = 0;
		var y2 = 0;
		if(axis.length == 2){
			x1 = Math.round((fromx + (tox-fromx)/4));
			y1 = Math.round((fromy + (toy-fromy)/4));
			x2 = Math.round((fromx + (tox-fromx)*3/4));
			y2 = Math.round((fromy + (toy-fromy)*3/4));
		} else {
			x1 = parseInt(axis[1][0]);
			y1 = parseInt(axis[1][1]);
			if(axis.length>3){
				x2 = parseInt(axis[2][0]);
				y2 = parseInt(axis[2][1]);
			}
		}
		var nowLineData = graphData.lines[line.id];
		var pre = nowLineData.from+"_"+nowLineData.to+"_"
		//画点
		var itemData1 = {
			"name"  : "",
			"id"    : pre+"node_split_1",
			"left"  : x1,
			"top"   : y1,
			"type"  : 'split',
			"width" : 6,
			"height": 6
		};
		addNodeItem(itemData1);
		var itemData2 = {
			"name"  : "",
			"id"    : pre+"node_split_2",
			"left"  : x2,
			"top"   : y2,
			"type"  : 'split',
			"width" : 6,
			"height": 6
		};
		addNodeItem(itemData2);
		//画线

		var itemData = {
			"id"       : pre+"line_split_1",
			"from"     : nowLineData.from,
			"to"       : pre+"node_split_1",
			"fromAxis" : [fromx,fromy],
			"toAxis"   : [x1,y1],
			"name"     : ""
		};
		addSplitLine(itemData);
		var itemData2 = {
			"id"       : pre+"line_split_2",
			"from"     : pre+"node_split_1",
			"to"       : pre+"node_split_2",
			"fromAxis" : [x1,y1],
			"toAxis"   : [x2,y2],
			"name"     :nowLineData.name
		};
		addSplitLine(itemData2);
		var itemData3 = {
			"id"       : pre+"line_split_3",
			"from"     : pre+"node_split_2",
			"to"       : nowLineData.to,
			"fromAxis" : [x2,y2],
			"toAxis"   : [tox,toy],
			"name"     : ""
		};
		addSplitLine(itemData3);
		//删除线
		canvas.removeChild(line);
		delete graphData.lines[line.id];
		//取消所有选择
        unSelectAll();
    };

    /**
     * 设置连接线选择
     * @param line
     * @return
     */
    function setLinkedLineHighLight(line){
		var path = line.childNodes[1];
		path.setAttribute("stroke","#ff3300");
		path.setAttribute("marker-end","url(#arrow2)"); 
    };

    function setLinkedLineDash(line){
        if(isSvg()){
            var path = line.childNodes[1];
            path.setAttribute("stroke","#ff3300");
            path.setAttribute("marker-end","url(#arrow2)");
            path.setAttribute("style", "stroke-dasharray:6,5");
            path.setAttribute("cursor","crosshair");
        }else{
            line.stroke.dashstyle="Dash";
            line.strokeColor="#ff3300";
            line.style.cursor="crosshair";
        }
    };


    /**
     * 选中连接点对象
     * @param line
     * @return
     */
    function selectLinkedLine(line){
        var lineId = null;
        if(isSvg()){
            lineId = line.getAttribute("id");
        }else{
            lineId = line.id;
        }
        unSelectAll();
        setLinkedLineHighLight(line);
        selectedElement = graphData.lines[lineId];
    };
	
    /**
     * 选中节点对象
     * @param item
     * @return
     */
    function selectedNodeItem(item){
        if(item&&item.tagName == "DIV"){
            unSelectAll();
            var oItem = $(item);
            var nodeId = oItem.attr("id");
            oItem.addClass("selectedNode");
            selectedElement = graphData.nodes[nodeId];

            if(!options.editable)return;
            $(".handle",oItem).show();
            $(".ico",oItem).css("cursor","move");
            /* 绑定拖动事件 */
            oItem.draggable({
                "proxy":"ghost",
                "handle":".ico",
                "disabled":false,
                onStartDrag:function(){},
                onStopDrag:function(e){
                    graphData.nodes[nodeId].left = oItem.offset().left - oItem.parent().offset().left;
                    graphData.nodes[nodeId].top  = oItem.offset().top  - oItem.parent().offset().top;
                    redrawNodeLinkedLine(oItem);
                }
            });
           
        };
    };

    /**
     * 重新绘制连接在节点上的连接线
     * @param node
     * @return
     */
    function redrawNodeLinkedLine(node){
        var lines = getNodeLinkedLines(node);
        for(var i=0;lines&&i<lines.length;i++){
            var line = lines[i];
            removeLinkedLine(line);
            addLinkedLine(line);
        }
    };

    /**
     *删除连接线
     */
    function removeLinkedLine(line){
        if(line.jQueryObject[0])canvas.removeChild(line.jQueryObject[0]);
        delete graphData.lines[line.id];
    };

    /**
     * 添加组件项事件绑定
     */
    function bindAddComponentItem(){
        workStage.on("click",function(evt){
            var e = evt || window.event;
            var tbxItemType = getSelectedTBXItemType();
            if(tbxItemType && tbxItemType != "pointer" && tbxItemType != "direct" && tbxItemType != "fork" ){
                var mousePosition = $.getMousePosition(e);
                var stageAxis =$.getDomElementAxis(this);
                var offsetLeft = mousePosition.x - stageAxis.left + this.parentNode.scrollLeft;
                var offsetTop =  mousePosition.y - stageAxis.top  + this.parentNode.scrollTop;
				var h = 100;
				var w = 24;
                var nodeItemData = {
                    "name"   : newNodeRecord.label+newNodeRecord.idx
                    ,"id"     : "node"+newNodeRecord.idx
                    ,"left"  : offsetLeft
                    ,"top"   : offsetTop
                    ,"type"  : tbxItemType
                    ,"width" : h
                    ,"height": w
                };
                addNodeItem(nodeItemData);
                newNodeRecord.idx++;
                $(".ico_pointer",toolBox).click();
            };
        });

    };

    /**
     *画线事件绑定
     */
    function bindDrawLine(){
        workStage.delegate(".nodeItem","mousedown",function(evt){
            if(getSelectedTBXItemType() != "direct") return;
            var e = evt || window.event;

            var mousePosition = $.getMousePosition(e);
            var stageAxis = $.getDomElementAxis(workStage[0]);

            var x = mousePosition.x - stageAxis.left + workStage[0].parentNode.scrollLeft;;
            var y = mousePosition.y - stageAxis.top  + workStage[0].parentNode.scrollTop;

            var lineStart = {"x":x,"y":y,"id":this.id,"nodeId":$(this).attr("id")};
			var axis = [[lineStart.x,lineStart.y],[lineStart.x,lineStart.y]];
            var line = drawLinkedLine("tmpNewLine",true,'',axis);
            workStage.data("lineStart",lineStart);

            canvas.appendChild(line);
        });

        //鼠标按下后拖动
        workStage.mousemove(function(e){
            //如果没有在组件工具箱上选中画线按钮项，则返回
            var tbxItemType = getSelectedTBXItemType();
            if(tbxItemType != "direct")	return;
            //保证鼠标被移入了一个节点中
            var lineStart = $(this).data("lineStart");
            if(!lineStart)return;

            var line=document.getElementById("tmpNewLine");
            var mousePosition = $.getMousePosition(e);
            var stageAxis = $.getDomElementAxis(this);

            var x = mousePosition.x - stageAxis.left + this.parentNode.scrollLeft;
            var y = mousePosition.y - stageAxis.top  + this.parentNode.scrollTop;

            if(isSvg()){
                line.childNodes[1].setAttribute("d","M "+lineStart.x+" "+lineStart.y+" L "+x+" "+y);
            }else{
                line.points.value=lineStart.x+","+lineStart.y+" "+x+","+y;
            }
        });

        //鼠标放开后，把起点记录删除掉
        workStage.mouseup(function(evt){
            var e = evt || window.event;
            var lineStart = $(this).data("lineStart");
            if(lineStart){
                //1.如果是画新线,则记录下目标节点
                var targetNode = $(e.target).parents(".nodeItem");
                var nodeId = targetNode.attr("id");

                if(nodeId){
                    var fromNodeId = getActualNodeId(lineStart.nodeId,true);
                    var toNodeId = getActualNodeId(nodeId,true);
                    var lineData = {
                        "id"   :"newLine"+newLineRecord.idx,
                        "from" :fromNodeId,
                        "to"   :toNodeId,
                        "type" : "linkLine"
                    };
                    addLinkedLine(lineData);
                    newLineRecord.idx++;
                }
            }

            //2.如果是画新线，则删除新线
            var tmpNewLine=document.getElementById("tmpNewLine");
            if(tmpNewLine)canvas.removeChild(tmpNewLine);

            //3.开始节点记录删除
            var tbxItemType = getSelectedTBXItemType();
            if(tbxItemType != "direct")	return;
            $(this).removeData("lineStart");
        });
    };

    /**
     *绑定鼠标移动到按钮上的相关事件
     */
    function bindMouseOverPointer(){
        //绑定鼠标覆盖/移出事件
        workStage.delegate(".nodeItem","mouseenter",function(e){
            if(getSelectedTBXItemType() == "direct"){
                $(this).addClass("drawLineMark");
            }
        });
        workStage.delegate(".nodeItem","mouseleave",function(e){
            if(getSelectedTBXItemType() == "direct"){
                $(this).removeClass("drawLineMark");
            }
        });
    };

    /**
     * 查找最边上的节点
     * @return 返回值为数组[0,1,2,3]依次为[上，左，下，右]
     */
    function findMaxOutterNode(){
        var nodeList = new Array();
        $(".nodeItem",workStage).each(function(){
            nodeList.push($(this));
        });

        var ltNode = null;	//最左上角节点
        var rbNode = null;	//最右下角节点

        var tNode = null;//最上的节点
        var lNode = null;//最左的节点
        var bNode = null;//最下的节点
        var rNode = null;//最右的节点

        if(nodeList.length>0){
            tNode = nodeList[0];
            lNode = nodeList[0];
            bNode = nodeList[0];
            rNode = nodeList[0];
        }
        //找最上节点
        for(var i=0;i<nodeList.length;i++){
            if(nodeList[i].offset().top<tNode.offset().top){
                tNode = nodeList[i];
            }
        }
        //找最左节点
        for(var i=0;i<nodeList.length;i++){
            if(nodeList[i].offset().left<lNode.offset().left){
                lNode = nodeList[i];
            }
        }
        //找最下的节点
        for(var i=0;i<nodeList.length;i++){
            var curNode = nodeList[i];
            if(curNode.offset().top+curNode.height()>bNode.offset().top+bNode.height()){
                bNode = curNode;
            }
        }
        //找最右的节点
        for(var i=0;i<nodeList.length;i++){
            var curNode = nodeList[i];
            if(curNode.offset().left+curNode.width()>rNode.offset().left+rNode.width()){
                rNode = curNode;
            }
        }

        return [tNode,lNode,bNode,rNode];
    };

    /*========================================================================
                      全局初始化操作
     ========================================================================*/

    initRenderTo(renderTo,renderWidth,renderHeight);								//1.初始化渲染对象的样式
    header = initHeader(renderTo,options);											//2.初始化header
    workWindowHeight = renderHeight-header.height()-10;	//计算工具箱高度
    toolBox = initComponentToolBox(renderTo,workWindowHeight,options.data.toolBox);	//3.初始化工具箱

    if(options.editable){
        workWindowWidth = renderWidth-toolBox.width()-15;
    }else{
        toolBox.hide();
        workWindowWidth = renderWidth-15;
    }

    workStage = initWorkStage(renderTo,workWindowWidth,workWindowHeight);
    canvas = initCanvas(workStage,workWindowWidth,workWindowHeight);

    //如果有初始化数据，则加载初始化数据
    if(options.data&&!$.isEmptyObject(options.data)){
        this.loadGraphData(options.data);
    }

    if(options.editable){
        $(".btn:first",toolBox).click();
        workStage.addClass("editable");
        bindSelectedItem();		//绑定选中对象事件
        bindAddComponentItem();	//组件工具箱被选中对象和画布单击事件添加组件的绑定
        bindMouseOverPointer();	//绑定鼠标移动到节点上按下后画线事件
        bindDrawLine();			//画线事件绑定
        bindLineDBLClick();		//画线双击事件绑定
    }else{
        workWindow.css("margin-left","8px");
    }
    //画布自动适应大小
    if(options.canvasAutoFixSize) this.canvasAutoFixSize();
};

/**
 * 几个辅助类全局函数
 */
$.extend({
    /**
     * 获取鼠标真实位置
     */
    getMousePosition : function(evt){
        var e = evt || window.event;
        if(e.pageX || e.pageY){
            return {
                x : e.pageX,
                y : e.pageY
            };
        }
        return{
            x : e.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
            y : e.clientY + document.documentElement.scrollTop  - document.body.clientTop
        };
    },
    /**
     *获取DOM元素的绝对坐标的功能函数
     */
    getDomElementAxis : function(domElement){
        var offsetTop = domElement.offsetTop;
        var offsetLeft = domElement.offsetLeft;
        var curElement = domElement.offsetParent;
        while (curElement) {
            offsetTop += curElement.offsetTop;
            offsetLeft += curElement.offsetLeft;
            curElement = curElement.offsetParent;
        };
        return {
            top: offsetTop,
            left: offsetLeft
        };
    }
});