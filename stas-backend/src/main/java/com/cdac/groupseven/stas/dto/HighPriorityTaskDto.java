package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.enums.TaskStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class HighPriorityTaskDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
}

