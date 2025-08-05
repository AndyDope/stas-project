package com.cdac.groupseven.stas.enums;

public enum TaskStatus {
    OVERDUE(5),
    PENDING(4),
    ACTIVE(3),
    INREVIEW(2),
    COMPLETED(1);

    private final int priority;

    TaskStatus(int priority) {
        this.priority = priority;
    }

    public int getPriority() {
        return priority;
    }
}

