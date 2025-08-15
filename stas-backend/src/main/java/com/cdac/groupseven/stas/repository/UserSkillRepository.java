package com.cdac.groupseven.stas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.groupseven.stas.entity.UserSkill;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

	// Custom query to find skills by user ID
	List<UserSkill> findByUserId(Long userId);

	// Custom query to find all users with a specific skill
	List<UserSkill> findBySkillName(String skillName);

	// Custom query to delete skills by user ID
	void deleteByUserId(Long userId);

}
