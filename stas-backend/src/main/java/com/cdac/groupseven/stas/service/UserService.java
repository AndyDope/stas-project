package com.cdac.groupseven.stas.service;

import com.cdac.groupseven.stas.dto.UserLoginRequestDto;
import com.cdac.groupseven.stas.dto.AuthResponse;
import com.cdac.groupseven.stas.dto.UserChangePassword;
import com.cdac.groupseven.stas.dto.UserDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;
import com.cdac.groupseven.stas.dto.UserUpdateDto;

public interface UserService {
    UserDto signup(UserSignupRequestDto signupDto);
    AuthResponse login(UserLoginRequestDto loginDto);
    UserDto updateDetails(UserUpdateDto updatedDto);
    UserDto changePassword(UserChangePassword changePasswordDto);
}
