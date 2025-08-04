package com.cdac.groupseven.stas.repository;

import com.cdac.groupseven.stas.entity.Feedback;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByGivenBy(User givenBy);
    List<Feedback> findByDeveloper(User developer);
    List<Feedback> findByTask(Task task);
}
