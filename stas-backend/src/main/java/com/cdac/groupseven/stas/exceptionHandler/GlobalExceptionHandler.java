package com.cdac.groupseven.stas.exceptionHandler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cdac.groupseven.stas.exception.ManagerNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ManagerNotFoundException.class)
    public ResponseEntity<String> handleManagerNotFound(ManagerNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> ErrorNotFound(Exception ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }
}

