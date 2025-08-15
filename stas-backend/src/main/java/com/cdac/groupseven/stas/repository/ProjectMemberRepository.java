package com.cdac.groupseven.stas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.groupseven.stas.entity.ProjectMember;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
	// Additional query methods can be defined here if needed
	// For example, to find all members of a specific project:
	// List<ProjectMember> findByProject(Project project);
	// Or to find all projects a user is a member of:
	// List<ProjectMember> findByUser(User user);

}
