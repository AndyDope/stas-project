package com.cdac.groupseven.stas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerGiveFeedbackRequest {
    private Long developerId;
    private Long projectId;
    private int rating;
    private String content;
    private Long taskId;
}
