package com.main026.walking.util.annotation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.TYPE_USE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Constraint(validatedBy = {PasswordValidator.class})
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
public @interface Password {

    String count = "[8-16]";

    String message() default "영문과 숫자의 조합 혹은 갯수가 " + count + "이 아닙니다.";

    Class<?>[] groups() default { };

    Class<? extends Payload>[] payload() default { };
}
