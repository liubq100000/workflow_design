package org.lc.design.dao;

import java.util.List;

import org.lc.design.domain.Node;

public interface NodeMapper {
	public List<Node> query(Node node);
	
	public java.lang.Integer insert(Node node);
	
	public java.lang.Integer delete();
}
