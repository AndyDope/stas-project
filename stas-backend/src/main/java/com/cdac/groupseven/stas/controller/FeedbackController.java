package com.cdac.groupseven.stas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.FeedbackData;
import com.cdac.groupseven.stas.dto.FeedbackHistoryDto;
import com.cdac.groupseven.stas.service.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
	
	@Autowired
	FeedbackService feedbackService;
	
	@GetMapping("/client/history")
	public ResponseEntity<List<FeedbackHistoryDto>> getMyFeedbackHistory(@RequestParam(value = "id") Long id) {
		return ResponseEntity.ok(feedbackService.getMyFeedbackHistory(id)); 
	}
	
	@PostMapping("/client")
	public ResponseEntity<FeedbackData> submitFeedback(@RequestBody FeedbackData feedbackData) {
		return ResponseEntity.ok(feedbackService.submitFeedback(feedbackData));
	}
}
