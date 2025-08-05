package com.cdac.groupseven.stas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.groupseven.stas.entity.Feedback;
import com.cdac.groupseven.stas.entity.Task;
import com.cdac.groupseven.stas.entity.User;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
	List<Feedback> findByAuthor(User author);
    List<Feedback> findByRecipient(User recipient);
    List<Feedback> findByTask(Task task);
}
