package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.entity.Feedback;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackHistoryDto {
    private Long id;
    private String subject;
    private int rating;
    private String content;
    
    public FeedbackHistoryDto(Feedback newFeedback) {
    	id = newFeedback.getId();
    	subject = newFeedback.getProject().getTitle();
    	rating = newFeedback.getRating();
    	content = newFeedback.getContent();
    }
}
