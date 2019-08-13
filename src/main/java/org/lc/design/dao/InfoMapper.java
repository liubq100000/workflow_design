package org.lc.design.dao;

import java.util.List;

import org.lc.design.domain.Info;

public interface InfoMapper {
	public List<Info> query(Info info);
	
	public java.lang.Integer insert(Info info);
	
	public java.lang.Integer delete(Info info);
}
