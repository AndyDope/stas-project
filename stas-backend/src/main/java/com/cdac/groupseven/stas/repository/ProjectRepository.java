package com.cdac.groupseven.stas.repository;

import java.util.List;
import java.util.Optional; //returns null if not found

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.enums.ProjectStatus;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<User> findByTitle(String title);    
    Optional<List<Project>> findByStatus(ProjectStatus status);
    List<Project> findByClientEmail(String email);
    Page<Project> findByClientEmail(String email, Pageable pageable);
    int countByManagerId(Long managerId);
}
