package com.cdac.groupseven.stas.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.dto.FeedbackData;
import com.cdac.groupseven.stas.dto.FeedbackHistoryDto;
import com.cdac.groupseven.stas.entity.Feedback;
import com.cdac.groupseven.stas.enums.ProjectStatus;
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
	public List<FeedbackHistoryDto> getMyFeedbackHistory(String email) {
		List<Feedback> feedbacksGiven = userRepository.findByEmail(email).get().getFeedbacksGiven();		
		return feedbacksGiven != null ? feedbacksGiven.stream().map(feedback -> new FeedbackHistoryDto(feedback)).toList() : null;
	}
	
	@Override
	public FeedbackData submitFeedback(String email, FeedbackData feedbackData) {
		
		if (!projectRepository.findById(feedbackData.getProjectId()).get().getStatus().equals(ProjectStatus.COMPLETED)) {
			throw new RuntimeException("Can't give feedback on incomplete projects");
		}
		
		Feedback newFeedback = new Feedback();
		newFeedback.setRating(feedbackData.getRating());
		newFeedback.setContent(feedbackData.getContent());
		newFeedback.setAuthor(userRepository.findByEmail(email).get());
		newFeedback.setProject(projectRepository.findById(feedbackData.getProjectId()).get());
		newFeedback.setRecipient(projectRepository.findById(feedbackData.getProjectId()).get().getManager());
		
		feedbackRepository.save(newFeedback);		
		return feedbackData;		
	}
}
