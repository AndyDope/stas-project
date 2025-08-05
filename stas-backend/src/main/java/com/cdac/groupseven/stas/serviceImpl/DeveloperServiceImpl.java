package com.cdac.groupseven.stas.serviceImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.entity.Feedback;
import com.cdac.groupseven.stas.entity.Task;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.entity.UserSkill;
import com.cdac.groupseven.stas.enums.TaskStatus;
import com.cdac.groupseven.stas.repository.FeedbackRepository;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.SkillRepository;
import com.cdac.groupseven.stas.repository.TaskRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.repository.UserSkillRepository;
import com.cdac.groupseven.stas.service.DeveloperService;

@Service
public class DeveloperServiceImpl implements DeveloperService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserSkillRepository userSkillRepository;
	
	@Autowired
	private TaskRepository taskRepository;
	
	@Autowired
	private SkillRepository skillRepository;
	
	@Autowired
	private FeedbackRepository feedbackRepository;

	@Override
	public Map<String, Object> getDeveloperDashboardStats(Long developerId) {
	    HashMap<String, Object> stats = new HashMap<>();
	    User developer = userRepository.findById(developerId)
	            .orElseThrow(() -> new RuntimeException("Developer not found with id: " + developerId));
	    stats.put("myTasks", developer.getAssignedTasks().size());
	    stats.put("overdue", developer.getAssignedTasks().stream()
	            .filter(usertask -> usertask.getTask().getDueDate().isBefore(java.time.LocalDate.now()) &&
	                    usertask.getTask().getStatus() != TaskStatus.COMPLETED)
	            .count());
	    stats.put("completed", developer.getAssignedTasks().stream()
	            .filter(usertask -> usertask.getTask().getStatus() == TaskStatus.COMPLETED)
	            .count());
	    stats.put("pending", developer.getAssignedTasks().stream()
	            .filter(usertask -> usertask.getTask().getStatus() == TaskStatus.PENDING)
	            .count());
	    return stats;
	}


	@Override
	public List<Map<String, Object>> getMyTasks(Long developerId) {
		
		
		List<Map<String, Object>> tasks = new ArrayList<Map<String,Object>>();
		
		User developer = userRepository.findById(developerId)
				.orElseThrow(() -> new RuntimeException("Developer not found with id: " + developerId));
		
		developer.getAssignedTasks().stream()
			.filter(usertask -> usertask.getTask().getStatus() != TaskStatus.COMPLETED)
			.forEach(usertask -> {
			HashMap<String, Object> taskDetails = new HashMap<>();
			taskDetails.put("id", usertask.getTask().getId());
			taskDetails.put("title", usertask.getTask().getTitle());
			taskDetails.put("dueDate", usertask.getTask().getDueDate());
			taskDetails.put("status", usertask.getTask().getStatus());
			tasks.add(taskDetails);
		});
		
		return tasks;
	}
	
	@Override
	public List<Map<String, Object>> getAllTasks(Long developerId) {
		
		
		List<Map<String, Object>> tasks = new ArrayList<Map<String,Object>>();
		
		User developer = userRepository.findById(developerId)
				.orElseThrow(() -> new RuntimeException("Developer not found with id: " + developerId));
		
		developer.getAssignedTasks().stream()
			.forEach(usertask -> {
			HashMap<String, Object> taskDetails = new HashMap<>();
			taskDetails.put("id", usertask.getTask().getId());
			taskDetails.put("title", usertask.getTask().getTitle());
			taskDetails.put("description", usertask.getTask().getDescription());
			taskDetails.put("dueDate", usertask.getTask().getDueDate());
			taskDetails.put("status", usertask.getTask().getStatus());
			tasks.add(taskDetails);
		});
		
		return tasks;
	}


	@Override
	public String updateTask(Long developerId, Long taskId , Map<String, Object> data) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
		task.setStatus(data.get("status") != null ? TaskStatus.valueOf(data.get("status").toString().toUpperCase()) : task.getStatus());
		taskRepository.save(task);
		return "Done";
	}


	@Override
	public List<String> getSkills(Long id) {
		User developer = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Developer not found with id: " + id));
		
		List<String> skills = new ArrayList<>();
		
		developer.getUserSkills().stream().
			forEach(skill -> {
				skills.add(skill.getSkill().getName());
			});
		
		return skills;
	}


	@Override
	public List<String> getAllSkills() {
		List<String> skills = new ArrayList<>();
		
		skillRepository.findAll().stream()
			.forEach(skill -> {
				skills.add(skill.getName());
			});
		
		return skills;
	}


	@Override
	public String addSkills(Long id, Map<String, String> skills) {
		User developer = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Developer not found with id: " + id));
		
		List<UserSkill> devSkills=developer.getUserSkills();
		
		if(!skills.containsKey("skill")) {
			throw new RuntimeException("Skills not provided");
		}
		
		UserSkill userSkill = new UserSkill();
		
		userSkill.setUser(developer);
		userSkill.setSkill(skillRepository.findByName(skills.get("skill"))
				.orElseThrow(() -> new RuntimeException("Skill not found with name: " + skills.get("skill"))));
		
		userSkillRepository.save(userSkill);
		return "Added skill successfully";
	}


	@Override
	public List<Map<String, Object>> getFeedbacks(Long userId) {
	    List<Feedback> feedbacks = feedbackRepository.findByRecipient(userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId)));
	    List<Map<String, Object>> result = new ArrayList<>();
	    for (Feedback feedback : feedbacks) {
	        Map<String, Object> feedbackMap = new HashMap<>();
	        feedbackMap.put("id", feedback.getId());
	        feedbackMap.put("content", feedback.getContent());
	        feedbackMap.put("rating", feedback.getRating());
	        Map<String, Object> taskMap = new HashMap<>();
	        taskMap.put("id", feedback.getTask().getId());
	        taskMap.put("title", feedback.getTask().getTitle());
	        feedbackMap.put("task", taskMap);
	        Map<String, Object> givenByMap = new HashMap<>();
	        givenByMap.put("id", feedback.getAuthor().getId());
	        givenByMap.put("name", feedback.getAuthor().getName());
	        feedbackMap.put("givenBy", givenByMap);
	        result.add(feedbackMap);
	    }
	    return result;
	}
	
	

}