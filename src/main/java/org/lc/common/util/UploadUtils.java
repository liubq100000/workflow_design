package org.lc.common.util;

import java.util.ArrayList;
import java.util.List;

public class UploadUtils {

	private static List<String> imgExt = new ArrayList<String>();

	static {
		imgExt.add("png");
		imgExt.add("jpg");
		imgExt.add("bmp");
		imgExt.add("jpeg");
		imgExt.add("jpe");
		imgExt.add("gif");
	}

	/**
	 * 获取文件名后缀
	 * 
	 * @param fileName
	 * @return
	 */
	public static String getFileExt(String fileName) {
		String fileExt = null;
		int index = fileName.lastIndexOf(".");
		if (index == -1) {
			fileExt = "";
		} else {
			fileExt = fileName.substring(index + 1).toLowerCase();
		}
		return fileExt;
	}

	/**
	 * 是否是图片
	 * 
	 * @param fileName
	 * @return
	 */
	public static boolean isImage(String fileName) {
		return imgExt.contains(getFileExt(fileName));
	}

	/**
	 * 是否是图片
	 * 
	 * @param fileName
	 * @return
	 */
	public static boolean isImageExt(String ext) {
		return imgExt.contains(ext);
	}
}
