package com.cdac.groupseven.stas.serviceImpl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.config.CustomUserDetails;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.repository.UserRepository;


@Service
public class CustomUserDetailsService implements UserDetailsService{

	@Autowired
	private UserRepository userRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		Optional<User> optionalUser = userRepo.findByEmail(username);
		
		User user=optionalUser.get();
		
		if(user==null) {
			System.out.println("User Not Found");
			throw new UsernameNotFoundException("User Not Fosund");
		}
		
		return new CustomUserDetails(user);
	}

}
