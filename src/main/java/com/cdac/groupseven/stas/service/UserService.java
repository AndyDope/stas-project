package com.cdac.groupseven.stas.service;

import com.cdac.groupseven.stas.dto.UserLoginRequestDto;
import com.cdac.groupseven.stas.dto.UserResponseDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;

public interface UserService {
    UserResponseDto signup(UserSignupRequestDto signupDto);
    UserResponseDto login(UserLoginRequestDto loginDto);
}
