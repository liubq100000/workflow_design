package org.lc.design.domain;

public class Line {
	private String id;
	private String wfDefId;
	private String wfCode;
	private String wfName;
	private String wfType;
	private String wfFrom;
	private String wfTo;
	private String json;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getWfDefId() {
		return wfDefId;
	}
	public void setWfDefId(String wfDefId) {
		this.wfDefId = wfDefId;
	}
	
	public String getWfCode() {
		return wfCode;
	}
	public void setWfCode(String wfCode) {
		this.wfCode = wfCode;
	}
	public String getWfName() {
		if("undefined".equalsIgnoreCase(wfName)||"null".equalsIgnoreCase(wfName)||wfName == null) {
			return "";
		}
		return wfName;
	}
	public void setWfName(String wfName) {
		this.wfName = wfName;
	}
	public String getWfType() {
		return wfType;
	}
	public void setWfType(String wfType) {
		this.wfType = wfType;
	}
	public String getWfFrom() {
		return wfFrom;
	}
	public void setWfFrom(String wfFrom) {
		this.wfFrom = wfFrom;
	}
	public String getWfTo() {
		return wfTo;
	}
	public void setWfTo(String wfTo) {
		this.wfTo = wfTo;
	}
	public String getJson() {
		return json;
	}
	public void setJson(String json) {
		this.json = json;
	}
	
	
	 
}
