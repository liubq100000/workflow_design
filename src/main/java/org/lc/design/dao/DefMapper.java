package org.lc.design.dao;

import java.util.List;

import org.lc.design.domain.Def;

public interface DefMapper {
	public List<Def> query(Def def);
	
	public java.lang.Integer insert(Def def);
	
	public java.lang.Integer delete(Def delCond);
}
