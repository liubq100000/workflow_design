package org.lc.design.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.lc.common.util.JsonUtil;
import org.lc.design.dao.DefMapper;
import org.lc.design.domain.Line;
import org.lc.design.domain.Node;
import org.springframework.stereotype.Component;

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
	
	public void save(String id,String nodeTxt,String lineTxt) {
		saveLine(id,lineTxt);
		saveNode(id,nodeTxt);
	}
	
	@SuppressWarnings("unchecked")
	private void saveNode(String defId,String nodeTxt) {
		nodeService.delete();
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
		lineService.delete();
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
