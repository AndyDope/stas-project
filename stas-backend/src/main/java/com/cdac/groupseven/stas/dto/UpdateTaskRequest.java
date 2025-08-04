package com.cdac.groupseven.stas.dto;

import java.time.LocalDate;
import com.cdac.groupseven.stas.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private Long assignedTo;
    private Long projectId;
    private TaskStatus status;
}