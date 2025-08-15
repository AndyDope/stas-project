package com.cdac.groupseven.stas.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int rating; // A quantitative rating from 1 to 5

    @Lob
    private String content; // The qualitative text feedback

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // --- The person who GAVE the feedback ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    // --- The person who RECEIVED the feedback (can be null) ---
    // This will be the Developer in the Manager -> Developer case.
    // This will be NULL in the Client -> Project case.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    // --- The SUBJECT of the feedback (at least one must be non-null) ---

    // This will be the Project in the Client -> Project case.
    // This will be NULL in the Manager -> Developer/Task case.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    // This will be the Task in the Manager -> Developer/Task case.
    // This can be NULL if the feedback is about the project in general.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}