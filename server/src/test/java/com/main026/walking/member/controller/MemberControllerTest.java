package com.main026.walking.member.controller;

import com.main026.walking.member.dto.MemberDto;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class MemberControllerTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    public static void init() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    public static void close() {
        validatorFactory.close();
    }

    @Test
    @DisplayName("회원가입유효성테스트")
    void PostDto() {
        //given
        String email = "e@email.com";
        String password = "12345678";
        String username = "1234";
        String si = "si";
        String gu = "gu";
        String dong = "dong";
        MemberDto.Post postDto = new MemberDto.Post(email, password, username, si, gu, dong);

        //when
        Set<ConstraintViolation<MemberDto.Post>> violations = validator.validate(postDto);

        //then
        assertThat(violations).isEmpty();

    }

}