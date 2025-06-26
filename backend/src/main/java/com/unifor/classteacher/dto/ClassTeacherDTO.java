package com.unifor.classteacher.dto;

import java.time.LocalDate;

public class ClassTeacherDTO {
    public Long id;

    public String userId;
    public String firstName;
    public String lastName;
    public String email;

    public Long classId;
    public String className;
    public LocalDate startDate;
    public LocalDate endDate;

    public Long curriculumId;
    public String semesterName;
    public String courseName;
}
