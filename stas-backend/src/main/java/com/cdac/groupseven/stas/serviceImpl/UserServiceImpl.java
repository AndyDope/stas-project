package com.cdac.groupseven.stas.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.dto.AuthResponse;
import com.cdac.groupseven.stas.dto.UserDto;
import com.cdac.groupseven.stas.dto.UserLoginRequestDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;
import com.cdac.groupseven.stas.dto.UserUpdateDto;
import com.cdac.groupseven.stas.entity.Role;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.repository.RoleRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.security.JwtUtil;
import com.cdac.groupseven.stas.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;
	
    @Override
    public UserDto signup(UserSignupRequestDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Invalid role"));

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user = userRepository.save(user);

        UserDto response = new UserDto();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return response;
    }
    
    @Override
    public AuthResponse login(UserLoginRequestDto authRequest) {
        
        // 1. Authenticate the user
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
        } catch (Exception e) {
            // If authentication fails, throw an exception (or return a 401 Unauthorized)
            throw new RuntimeException("Error: Invalid credentials");
        }

        // 2. If authentication is successful, load UserDetails to generate the token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());

        // 3. Generate the JWT token
        final String jwt = jwtUtil.generateToken(userDetails);
        
        // 4. Get the full User entity to create the UserDto
        final User user = userRepository.findByEmail(authRequest.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        
        // 5. Create the UserDto
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());

        // 6. Return the token and user DTO in the response
        return new AuthResponse(jwt, userDto);
    }

	@Override
	public UserDto updateDetails(UserUpdateDto data) {

		User user = userRepository.findById(data.getId()).get();
		user.setName(data.getName());
		user.setEmail(data.getEmail());
		
		userRepository.save(user);

		UserDto response = new UserDto();		
		response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
		
		return response;
	}
}