package com.cdac.groupseven.stas.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.dto.FeedbackData;
import com.cdac.groupseven.stas.dto.FeedbackHistoryDto;
import com.cdac.groupseven.stas.entity.Feedback;
import com.cdac.groupseven.stas.repository.FeedbackRepository;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.FeedbackService;

@Service
public class FeedbackServiceImpl implements FeedbackService {

	@Autowired
	UserRepository userRepository;
	
	@Autowired
	FeedbackRepository feedbackRepository;
	
	@Autowired
	ProjectRepository projectRepository;
	
	@Override
	public List<FeedbackHistoryDto> getMyFeedbackHistory(Long id) {
		List<Feedback> feedbacksGiven = userRepository.findById(id).get().getFeedbacksGiven();		
		return feedbacksGiven != null ? feedbacksGiven.stream().map(feedback -> new FeedbackHistoryDto(feedback)).toList() : null;
	}
	
	@Override
	public FeedbackData submitFeedback(FeedbackData feedbackData) {
		Feedback newFeedback = new Feedback();
		newFeedback.setRating(feedbackData.getRating());
		newFeedback.setContent(feedbackData.getContent());
		newFeedback.setAuthor(userRepository.findById(feedbackData.getClientId()).get());
		newFeedback.setProject(projectRepository.findById(feedbackData.getProjectId()).get());
		
		feedbackRepository.save(newFeedback);		
		return feedbackData;		
	}
}
