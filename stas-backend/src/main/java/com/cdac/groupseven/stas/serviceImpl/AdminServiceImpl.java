package com.cdac.groupseven.stas.serviceImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.dto.AdminDashboardDto;
import com.cdac.groupseven.stas.dto.ProjectDto;
import com.cdac.groupseven.stas.dto.UserManageDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.entity.Role;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.enums.TaskStatus;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.RoleRepository;
import com.cdac.groupseven.stas.repository.SkillRepository;
import com.cdac.groupseven.stas.repository.TaskRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private RoleRepository roleRepository;


	@Override
	public UserManageDto createAdminUser(UserSignupRequestDto dto) {
		// 1. Validate the roleId
		
        if (dto.getRoleId() == null || !dto.getRoleId().equals(1L)) {
            throw new RuntimeException("Only roleId=1 (ADMIN) is allowed to be created.");
        }

        // 2. Check if email already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists.");
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
        return new UserManageDto(user);
	}
    
    @Override
    public Map<String, Object> getAdminDashboardData() {
        int totalUsers = (int) userRepository.count();
        int totalProjects = (int) projectRepository.count();
        int tasksCompleted = taskRepository.countByStatus(TaskStatus.COMPLETED);
        int skillsDefined = (int) skillRepository.count();

        // Get user count by role
        Map<String, Integer> roleDistribution = new HashMap<>();
        List<Role> roles = roleRepository.findAll();
        for (Role role : roles) {
            int count = userRepository.countByRole(role); // you must implement this
            roleDistribution.put(role.getRoleName().toUpperCase(),count);
        }
                
        Map<String, Object> dashboardData = new HashMap<>();
        List<ProjectDto> recentProjects = new ArrayList<>();
        List<Project> allProjects = projectRepository.findAll();
        
        for (int i = 0; i < 10 && i < allProjects.size() ; i++)
        	recentProjects.add(new ProjectDto(allProjects.get(i)));
        
        dashboardData.put("stats", new AdminDashboardDto(totalUsers, totalProjects, tasksCompleted, skillsDefined, roleDistribution));                
        dashboardData.put("recentProjects", recentProjects);

        return dashboardData;
    }
}