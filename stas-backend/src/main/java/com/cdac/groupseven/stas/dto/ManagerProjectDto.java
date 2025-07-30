package com.cdac.groupseven.stas.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ManagerProjectDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status; // or use enum if needed
}

