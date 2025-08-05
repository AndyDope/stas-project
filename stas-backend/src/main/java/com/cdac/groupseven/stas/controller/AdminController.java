package com.cdac.groupseven.stas.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cdac.groupseven.stas.dto.AdminDashboardDto;
import com.cdac.groupseven.stas.dto.UserChangePassword;
import com.cdac.groupseven.stas.dto.UserManageDto;
import com.cdac.groupseven.stas.dto.UserResponseDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;
import com.cdac.groupseven.stas.dto.UserUpdateDto;
import com.cdac.groupseven.stas.entity.Role;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.repository.RoleRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.AdminService;
import com.cdac.groupseven.stas.service.UserService;
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // for Vite dev server
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    

    @GetMapping("/dashboard-data")
    public ResponseEntity<AdminDashboardDto> getAdminDashboardData() {
        return ResponseEntity.ok(adminService.getAdminDashboardData());
    }

    @GetMapping("/manage-users")
    public ResponseEntity<List<UserManageDto>> getAllUsersForManagement() {
        List<UserManageDto> users = userRepository.findAll()
            .stream()
            .map(UserManageDto::new)  // uses the constructor from UserManageDto
            .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }
    
    //for creating the new admin
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdminUser(@RequestBody UserSignupRequestDto dto) {
        try {
            // 1. Validate the roleId
            if (dto.getRoleId() == null || !dto.getRoleId().equals(1L)) {
                return ResponseEntity.badRequest().body("Only roleId=1 (ADMIN) is allowed to be created.");
            }

            // 2. Check if email already exists
            if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists.");
            }

            // 3. Fetch ADMIN role
            Role role = roleRepository.findByRoleName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            // 4. Create and save new user
            User user = new User();
            user.setName(dto.getName());
            user.setEmail(dto.getEmail());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setRole(role);

            userRepository.save(user);

            // 5. Return minimal DTO (no password, no token)
            return ResponseEntity.ok(new UserManageDto(user));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating admin: " + e.getMessage());
        }
    }
    
    //update the information of a user
    @PutMapping("/manage-users/{id}")
    public ResponseEntity<UserManageDto> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateDto userUpdateDto) {

        return userRepository.findById(id).map(user -> {
            user.setName(userUpdateDto.getName());
            user.setEmail(userUpdateDto.getEmail());

            // Set role only if provided
            if (userUpdateDto.getRole() != null) {
                Role role = roleRepository.findByRoleName(userUpdateDto.getRole().toUpperCase())
                        .orElseThrow(() -> new RuntimeException("Invalid role: " + userUpdateDto.getRole()));
                user.setRole(role);
            }

            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(new UserManageDto(updatedUser));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    
    @DeleteMapping("/manage-users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
    	if(!userRepository.existsById(id)) {
    		return ResponseEntity.notFound().build();
    	}
    	
    	userRepository.deleteById(id);
    	return ResponseEntity.noContent().build();
    }
}