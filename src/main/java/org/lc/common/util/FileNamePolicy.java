package org.lc.common.util;

import java.util.UUID;

public class FileNamePolicy {

	private String fileExt;
	private String newNameBase;

	public FileNamePolicy(String oriName) {
		this.fileExt = UploadUtils.getFileExt(oriName);
		newNameBase = UUID.randomUUID().toString();
	}

	public String getNewFileName() {
		return newNameBase + "." + fileExt;
	}

	public String getThumbnailFilename() {
		return newNameBase + "-thumbnail.png";
	}

	public String getFileExt() {
		return this.fileExt;
	}

}
