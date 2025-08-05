package com.cdac.groupseven.stas.enums;

public enum TaskStatus {
    OVERDUE(4),
    PENDING(3),
    ACTIVE(2),
    COMPLETED(1);

    private final int priority;

    TaskStatus(int priority) {
        this.priority = priority;
    }

    public int getPriority() {
        return priority;
    }
}

