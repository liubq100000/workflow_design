package org.lc.design.service;

import java.util.List;

import javax.annotation.Resource;

import org.lc.design.dao.NodeMapper;
import org.lc.design.domain.Node;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class NodeService {

	@Resource(name = "nodeMapper")
	private NodeMapper nodeMapper;

	 
	public List<Node> query(Node node){
		return nodeMapper.query(node);
	}
	
	@Transactional(rollbackFor=Exception.class,propagation=Propagation.REQUIRED)
	public java.lang.Integer insert(Node node){
		return nodeMapper.insert(node);
	}
	
	@Transactional(rollbackFor=Exception.class,propagation=Propagation.REQUIRED)
	public java.lang.Integer delete(String flowId){
		Node node = new Node();
		node.setWfDefId(flowId);
		return nodeMapper.delete(node);
	}
	
}
