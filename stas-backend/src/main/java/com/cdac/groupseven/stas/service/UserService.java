package com.cdac.groupseven.stas.service;

import com.cdac.groupseven.stas.dto.UserChangePassword;
import com.cdac.groupseven.stas.dto.UserLoginRequestDto;
import com.cdac.groupseven.stas.dto.UserResponseDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;
import com.cdac.groupseven.stas.dto.UserUpdateDto;

public interface UserService {
    UserResponseDto signup(UserSignupRequestDto signupDto);
    UserResponseDto login(UserLoginRequestDto loginDto);
    UserResponseDto updateDetails(UserUpdateDto updatedDto);
    UserResponseDto changePassword(UserChangePassword changePasswordDto);
}