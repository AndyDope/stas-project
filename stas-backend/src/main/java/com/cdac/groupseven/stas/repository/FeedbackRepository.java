package com.cdac.groupseven.stas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.groupseven.stas.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

}
