package com.cdac.groupseven.stas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cdac.groupseven.stas.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}