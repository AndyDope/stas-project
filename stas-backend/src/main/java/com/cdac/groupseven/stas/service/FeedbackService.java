package com.cdac.groupseven.stas.service;

import java.util.List;

import com.cdac.groupseven.stas.dto.FeedbackData;
import com.cdac.groupseven.stas.dto.FeedbackHistoryDto;

public interface FeedbackService {
	List<FeedbackHistoryDto> getMyFeedbackHistory(Long id);
	FeedbackData submitFeedback(FeedbackData feedbackData);
}
