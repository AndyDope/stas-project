package com.cdac.groupseven.stas.exception;

public class ManagerNotFoundException extends RuntimeException {
    public ManagerNotFoundException(Long id) {
        super("Manager with ID " + id + " not found");
    }
}

