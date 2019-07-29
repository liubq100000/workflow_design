package org.lc.design.service;

import java.util.List;

import javax.annotation.Resource;

import org.lc.design.dao.NodeMapper;
import org.lc.design.domain.Node;
import org.springframework.stereotype.Component;

@Component
public class NodeService {

	@Resource(name = "nodeMapper")
	private NodeMapper nodeMapper;

	 
	public List<Node> query(Node node){
		return nodeMapper.query(node);
	}
	
	public java.lang.Integer insert(Node node){
		return nodeMapper.insert(node);
	}
	
	public java.lang.Integer delete(){
		return nodeMapper.delete();
	}
	
}
