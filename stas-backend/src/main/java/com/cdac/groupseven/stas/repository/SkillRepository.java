package com.cdac.groupseven.stas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdac.groupseven.stas.entity.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
}