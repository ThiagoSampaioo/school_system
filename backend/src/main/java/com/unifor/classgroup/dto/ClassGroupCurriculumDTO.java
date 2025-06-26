package com.unifor.classgroup.dto;

import com.unifor.classgroup.ClassGroup;
import com.unifor.course.Course;    
import com.unifor.subject.Subject;
import com.unifor.semester.Semester;
import java.util.List;

public class ClassGroupCurriculumDTO {
    public Long id;
    public CourseInfo course;

    public ClassGroupCurriculumDTO(ClassGroup cg, List<Subject> subjects) {
        this.id = cg.id;
        this.course = new CourseInfo(cg.curriculumMatrix.course, cg.curriculumMatrix.semester, subjects);
    }

    public static class CourseInfo {
        public Long id;
        public String name;
        public String semester;
        public List<SubjectInfo> subjects;

        public CourseInfo(Course course, Semester semester, List<Subject> subjects) {
            this.id = course.id;
            this.name = course.name;
            this.semester = semester.year + "." + semester.name; // ex: "2025.1"
            this.subjects = subjects.stream()
                .map(s -> new SubjectInfo(s.id, s.name))
                .toList();
        }
    }

    public static class SubjectInfo {
        public Long id;
        public String name;

        public SubjectInfo(Long id, String name) {
            this.id = id;
            this.name = name;
        }
    }
}
