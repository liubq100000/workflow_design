package org.lc.common.vo;

import java.io.Serializable;

/**
 * 返回前台的公共结果
 * 
 * @author liubq
 */
public class ResVO implements Serializable {

	/**
	 * 构造
	 * 
	 * @param success
	 * @param message
	 */
	public ResVO(boolean success, String message) {
		this.success = success;
		this.message = message;
	}

	/**
	 * 构造
	 * 
	 * @param success
	 * @param message
	 * @param data
	 */
	public ResVO(boolean success, String message, Object data) {
		this.success = success;
		this.message = message;
		this.dataVO = data;
	}

	// 是否成功
	private boolean success;

	// 显示消息
	private String message;

	// 数据处理
	private Object dataVO;

	/**
	 * 取得是否成功
	 * 
	 * @return 是否成功
	 */
	public boolean getSuccess() {
		return success;
	}

	/**
	 * 设定是否成功
	 * 
	 * @param success 是否成功
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}

	/**
	 * 取得显示消息
	 * 
	 * @return 显示消息
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * 设定显示消息
	 * 
	 * @param message 显示消息
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 * 取得数据
	 * 
	 * @return 数据
	 */
	public Object getDataVO() {
		return dataVO;
	}

	/**
	 * 设定数据
	 * 
	 * @param dataVO 数据
	 */
	public void setDataVO(Object dataVO) {
		this.dataVO = dataVO;
	}

}
