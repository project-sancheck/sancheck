package com.main026.walking.util.annotation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class PasswordValidator implements ConstraintValidator<Password,String> {

    @Override
    public void initialize(Password constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {

        String pattern = "^(?=.*\\d)(?=.*[a-zA-Z])[\\da-zA-Z]{8,16}";
        boolean matches = Pattern.matches(pattern,value);
        if(!matches){
            return false;
        }
        return true;
    }
}
