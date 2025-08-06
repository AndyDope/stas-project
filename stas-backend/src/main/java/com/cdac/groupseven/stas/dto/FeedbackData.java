package com.cdac.groupseven.stas.dto;

import lombok.Data;

@Data
public class FeedbackData {
//	private Long clientId;
	private Long projectId;
	private int rating;
	private String content;
}
