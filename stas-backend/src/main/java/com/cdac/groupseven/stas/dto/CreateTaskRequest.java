package com.cdac.groupseven.stas.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private Long assignedTo;
    private Long assignedBy;
    private Long projectId;

}
