package com.cdac.groupseven.stas.entity;

import java.time.LocalDate;
import java.util.List;

import com.cdac.groupseven.stas.enums.TaskStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private LocalDate dueDate; 

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "assigned_by")
    private User manager; // Role = Manager

    @OneToMany(mappedBy = "task")
    private List<UserTask> assignedDevelopers;

    @OneToMany(mappedBy = "task")
    private List<TaskSkill> requiredSkills;
}
