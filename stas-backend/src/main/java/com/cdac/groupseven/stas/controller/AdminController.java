package com.cdac.groupseven.stas.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.UserManageDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;
import com.cdac.groupseven.stas.dto.UserUpdateDto;
import com.cdac.groupseven.stas.entity.Role;
import com.cdac.groupseven.stas.entity.Skill;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.repository.RoleRepository;
import com.cdac.groupseven.stas.repository.SkillRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private SkillRepository	skillRepository;
    
    @GetMapping("/dashboard-data")
    public ResponseEntity<Map<String, Object>> getAdminDashboardData() {
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
            return ResponseEntity.ok(adminService.createAdminUser(dto));

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
    
	@GetMapping("/skills")
	public ResponseEntity<List<Map<String, Object>>> getAllSkills() {
		List<Map<String, Object>> allSkills = new ArrayList<>();
		List<Skill> skills = skillRepository.findAll();
		
		skills.forEach(skill -> {
			Map<String, Object> skillMap = new HashMap<>();
			skillMap.put("id", skill.getId());
			skillMap.put("name", skill.getName());
			allSkills.add(skillMap);
		});
		
		return ResponseEntity.ok(allSkills);
	}
	
	@PostMapping("/skills")
	public ResponseEntity<String> addSkill(@RequestBody Map<String, String> skillData) {
		String skillName = skillData.get("name");
		if (skillName == null || skillName.isEmpty()) {
			return ResponseEntity.badRequest().body("Skill name is required");
		}
		
		Skill newSkill = new Skill();
		newSkill.setName(skillName.toUpperCase());
		skillRepository.save(newSkill);
		
		return ResponseEntity.ok("Skill added successfully");
	}
	
	@DeleteMapping("/skills/{id}")
	public ResponseEntity<String> deleteSkill(@PathVariable Long id) {
		if (!skillRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		
		skillRepository.deleteById(id);
		return ResponseEntity.ok("Skill deleted successfully");
	}
    
}