package org.lc.design.service;

import java.util.HashMap;
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
	
	public Map<String,Object> query(String id) {
		Map<String,Object> resMap = new HashMap<String,Object>();
		if(id == null||id.trim().length()<=0) {
			return resMap;
		}
		Line condLine = new Line();
		condLine.setWfDefId(id);
		List<Line> lineList = lineService.query(condLine);
		resMap.put("lineList", lineList);
		
		Node condNode = new Node();
		condNode.setWfDefId(id);
		List<Node> nodeList = nodeService.query(condNode);
		resMap.put("nodeList", nodeList);
		return resMap;
	}
	
	/**
	 * 保存
	 * 
	 * @param cond
	 * @param nodeTxt
	 * @param lineTxt
	 */
	@Transactional(rollbackFor=Exception.class,propagation=Propagation.REQUIRED)
	public void save(Def cond,String nodeTxt,String lineTxt) {
		saveLine(cond.getId(),lineTxt);
		saveNode(cond.getId(),nodeTxt);
	}
	
	@SuppressWarnings("unchecked")
	private void saveNode(String defId,String nodeTxt) {
		//删除旧数据
		nodeService.delete();
		//插入新数据
		List<Map<String,String>> nodeList = JsonUtil.toBean(nodeTxt, List.class);
		for(Map<String,String> item:nodeList) {
			Node node = new Node();
			node.setId(item.get("id"));
			node.setWfDefId(defId);
			node.setWfCode(item.get("code"));
			node.setWfName(item.get("name"));
			node.setWfType(item.get("type"));
			node.setJson(JsonUtil.toString(item));
			nodeService.insert(node);
		}
	}
	
	@SuppressWarnings("unchecked")
	private void saveLine(String defId,String lineTxt) {
		//删除旧数据
		lineService.delete();
		//插入新数据
		List<Map<String,String>> LineList = JsonUtil.toBean(lineTxt, List.class);
		for(Map<String,String> item:LineList) {
			Line line = new Line();
			line.setId(item.get("id"));
			line.setWfDefId(defId);
			line.setWfCode(item.get("code"));
			line.setWfName(item.get("name"));
			line.setWfType(item.get("type"));
			line.setWfFrom(item.get("from"));
			line.setWfTo(item.get("to"));
			line.setJson(JsonUtil.toString(item));
			lineService.insert(line);
		}
	}
	
	
	
}
