package com.cdac.groupseven.stas.repository;

import java.util.List;
import java.util.Optional; //returns null if not found

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.enums.Status;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<User> findByTitle(String title);
    
    Optional<List<Project>> findByStatus(Status status);
}
