package com.cdac.groupseven.stas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.UserLoginRequestDto;
import com.cdac.groupseven.stas.dto.UserResponseDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.UserService;

//@CrossOrigin
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> signup(@RequestBody UserSignupRequestDto dto) {
        try {
			UserResponseDto user = userService.signup(dto);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().build();
		}
    }
    
    @PostMapping("/login")
    public UserResponseDto login(@RequestBody UserLoginRequestDto dto) {
        return userService.login(dto);
    }
    
    @GetMapping("/all")
    public List<User> getAllUsers() {
		return userRepository.findAll();
		
    }
}
