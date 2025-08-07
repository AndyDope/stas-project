package com.cdac.groupseven.stas.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdac.groupseven.stas.entity.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
	
		// Additional query methods can be defined here if needed
	// For example, to find a skill by name:
	Optional<Skill> findByName(String name);
	Boolean existsByName(String name);
}