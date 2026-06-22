package ru.superchack.security.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.superchack.security.dto.AuthRequest;
import ru.superchack.security.dto.AuthResponse;
import ru.superchack.security.model.Role;
import ru.superchack.security.model.User;
import ru.superchack.security.repository.RoleRepository;
import ru.superchack.security.repository.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(AuthRequest request) {
        log.debug("Регистрация пользователя: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Пользователь с таким именем уже существует");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Роль ROLE_USER не найдена"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .build();

        user.getRoles().add(userRole);
        userRepository.save(user);

        log.info("Пользователь зарегистрирован: {}", user.getUsername());

        return AuthResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .message("Регистрация успешна")
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        log.debug("Вход пользователя: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        log.info("Пользователь вошёл: {}", user.getUsername());

        return AuthResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .message("Вход выполнен успешно")
                .build();
    }
}