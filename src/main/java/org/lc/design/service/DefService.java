package org.lc.design.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.lc.common.util.JsonUtil;
import org.lc.design.dao.DefMapper;
import org.lc.design.domain.Def;
import org.lc.design.domain.Line;
import org.lc.design.domain.Node;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DefService {

	@Resource(name = "defMapper")
	private DefMapper defMapper;
	
	@Resource(name = "nodeService")
	private NodeService nodeService;

	@Resource(name = "lineService")
	private LineService lineService;
	
	public Def query(String id) {
		if(id == null||id.length()<=0) {
			return null;
		}
		Def cond = new Def();
		cond.setId(id);
		List<Def> defList = defMapper.query(cond);
		if(defList==null||defList.size()<=0) {
			return null;
		}
		return defList.get(0);
	}
	
	/**
	 * 保存
	 * 
	 * @param cond
	 * @param nodeTxt
	 * @param lineTxt
	 */
	
	@SuppressWarnings("unchecked")
	@Transactional(rollbackFor=Exception.class,propagation=Propagation.REQUIRED)
	public void save(String flowId,String content) throws Exception {		
		System.out.println("content="+content);
		//String flowId = request.getParameter("flowId");
		Map<Object,Object> dataMap = (Map<Object,Object>)JsonUtil.toBean(content, Map.class);
		if(dataMap==null) {
			throw new Exception("Json 转换异常");
		}
		//保存整体
		modify(flowId,dataMap,content);
		//保存节点
		saveNode(flowId,dataMap);
		//保存连接线
		saveLine(flowId,dataMap);
	}
	
	/**
	 * 修改
	 * @param cond
	 * @throws Exception 
	 */
	@SuppressWarnings("unchecked")
	private void modify(String flowId,Map<Object,Object> dataMap,String content) throws Exception {		
		Map<Object,Object> infoMap = (Map<Object,Object>)dataMap.get("infos");
		if(infoMap==null) {
			throw new Exception("Json 转换异常");
		}
		Def def = new Def();
		def.setId(flowId);
		def.setName((String)infoMap.get("name"));
		def.setCode((String)infoMap.get("code"));
		def.setTxt((String)infoMap.get("desc"));		
		def.setContent(content);
		//删除旧数据
		Def delCond = new Def();
		delCond.setId(flowId);
		defMapper.delete(delCond);
		//插入数据
		defMapper.insert(def);
	}
//	"rect1565667826915": {
//        "props": {
//            "text": {
//                "value": "结束"
//            }
//        }, 
//        "type": "end", 
//        "ID": "", 
//        "text": {
//            "text": "结束"
//        }, 
//        "attr": {
//            "x": 372, 
//            "y": 422, 
//            "width": 50, 
//            "height": 50
//        }
//    }
	/**
	 * 保存节点
	 * 
	 * @param defId
	 * @param nodeTxt
	 * @throws Exception 
	 */
	@SuppressWarnings("unchecked")
	private void saveNode(String flowId,Map<Object,Object> dataMap) throws Exception {
		nodeService.delete(flowId);
		Map<Object,Object> stateMap = (Map<Object,Object>)dataMap.get("states");
		if(stateMap==null) {
			throw new Exception("Json 转换异常");
		}
		Map<Object, Object> attProps;
		Map<Object, Object> props;
		Map<Object, Object> texts;
		Map<Object, Object> subMap;
		for(Map.Entry<Object, Object> entry:stateMap.entrySet()) {
			Node node = new Node();
			node.setId((String)entry.getKey());
			node.setWfDefId(flowId);
			attProps = (Map<Object, Object>)entry.getValue();
			
			if(attProps!=null) {
				node.setWfType((String)attProps.get("type"));
				node.setJson(JsonUtil.toString(attProps.get("attr")));
				texts = (Map<Object, Object>)attProps.get("text");
				
				subMap = null;
				node.setWfName((String)texts.get("text"));	
				props = (Map<Object, Object>)attProps.get("props");
				subMap = null;
				subMap = (Map<Object, Object>)props.get("code");
				if(subMap!=null) {
					node.setWfCode((String)subMap.get("value"));	
				}				
				
			}
			nodeService.insert(node);
		}
	}
//	"path1565667390652": {
//        "lineID": "", 
//        "from": "rect1565660097267", 
//        "to": "rect1565660098176", 
//        "dots": [ ], 
//        "text": {
//            "text": "", 
//            "textPos": {
//                "x": 0, 
//                "y": -10
//            }
//        }, 
//        "props": {
//            "code": {
//                "value": "code_1565667823175"
//            }, 
//            "text": {
//                "value": ""
//            }
//        }
//    }, 
	/**
	 * 保存连接线
	 * 
	 * @param defId
	 * @param lineTxt
	 */
	@SuppressWarnings("unchecked")
	private void saveLine(String flowId,Map<Object,Object>dataMap) {
		//删除旧数据
		lineService.delete(flowId);
		Map<Object,Object> pathMap = (Map<Object,Object>)dataMap.get("paths");
		//插入新数据
		Map<Object, Object> attProps;
		Map<Object, Object> props;
		Map<Object, Object> texts;
		Map<Object, Object> subMap;
		for(Map.Entry<Object, Object> entry:pathMap.entrySet()) {
			Line line = new Line();
			line.setId((String)entry.getKey());
			line.setWfDefId(flowId);
			attProps = (Map<Object, Object>)entry.getValue();
			
			if(attProps!=null) {
				line.setWfType((String)attProps.get("type"));
				line.setJson(JsonUtil.toString(attProps.get("attr")));
				line.setWfFrom((String)attProps.get("from"));
				line.setWfTo((String)attProps.get("to"));				
				texts = (Map<Object, Object>)attProps.get("text");				
				if(texts!=null) {
					line.setWfName((String)texts.get("text"));	
				}				
				props = (Map<Object, Object>)attProps.get("props");
				if(props!=null) {
					subMap = null;
					subMap = (Map<Object, Object>)props.get("code");
					if(subMap!=null) {
						line.setWfCode((String)subMap.get("value"));	
					}
				}							
				line.setJson(JsonUtil.toString(attProps.get("dots")));
				
			}
			lineService.insert(line);
		}
	}
	
	
	
}
