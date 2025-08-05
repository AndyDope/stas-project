package com.cdac.groupseven.stas.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.UserChangePassword;
import com.cdac.groupseven.stas.dto.UserDto;
import com.cdac.groupseven.stas.dto.UserLoginRequestDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;
import com.cdac.groupseven.stas.dto.UserUpdateDto;
import com.cdac.groupseven.stas.service.UserService;

//@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserDto> signup(@RequestBody UserSignupRequestDto dto) {
        try {
			UserDto user = userService.signup(dto);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().build();
		}
    }
   

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody UserLoginRequestDto authRequest) throws Exception {
		try {
			return ResponseEntity.ok(userService.login(authRequest));
		} catch (RuntimeException e) {
			return ResponseEntity.status(401).body("Error: Invalid credentials");
		}
    }
    
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserUpdateDto dto) {
        try {
			UserDto user = userService.updateDetails(dto);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().build();
		}
    }
    
    //for changing the userPassword
    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@RequestBody UserChangePassword dto) {
        try {
            userService.changePassword(dto);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
