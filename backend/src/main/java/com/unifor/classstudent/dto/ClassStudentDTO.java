package com.unifor.classstudent.dto;

import java.time.LocalDate;

public class ClassStudentDTO {
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
