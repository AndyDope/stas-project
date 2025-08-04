package com.cdac.groupseven.stas.dto;

import lombok.Data;

@Data
public class ManagerUpdateProjectRequestDto {
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private String status;
    
}
