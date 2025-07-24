package com.cdac.groupseven.stas.repository;

import java.util.List;
import java.util.Optional; //returns null if not found

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdac.groupseven.stas.entity.Role;
import com.cdac.groupseven.stas.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<List<User>> findByRole(Role role);
}
