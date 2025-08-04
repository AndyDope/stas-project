package com.cdac.groupseven.stas.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.dto.AdminDashboardDto;
import com.cdac.groupseven.stas.entity.Role;
import com.cdac.groupseven.stas.enums.TaskStatus;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.SkillRepository;
import com.cdac.groupseven.stas.repository.TaskRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.repository.RoleRepository;
import com.cdac.groupseven.stas.service.AdminService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public AdminDashboardDto getAdminDashboardData() {
        int totalUsers = (int) userRepository.count();
        int totalProjects = (int) projectRepository.count();
        int tasksCompleted = taskRepository.countByStatus(TaskStatus.COMPLETED);
        int skillsDefined = (int) skillRepository.count();

        // Get user count by role
        Map<String, Integer> roleDistribution = new HashMap<>();
        List<Role> roles = roleRepository.findAll();
        for (Role role : roles) {
            int count = userRepository.countByRole(role); // you must implement this
            roleDistribution.put(role.getRoleName(), count);
        }

        return new AdminDashboardDto(
                totalUsers,
                totalProjects,
                tasksCompleted,
                skillsDefined,
                roleDistribution
        );
    }
}