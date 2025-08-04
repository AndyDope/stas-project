package com.cdac.groupseven.stas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

//@Data
//public class ManagerProjectDto {
//    private Long id;
//    private String title;
//    private String description;
//    private LocalDate startDate;
//    private LocalDate endDate;
//    private String status; // or use enum if needed
//}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerProjectDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private int openTasks;
    private int completion;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<MemberDto> members;
}


