package com.unifor.curriculum;

import com.unifor.course.Course;
import com.unifor.semester.Semester;
import com.unifor.subject.Subject;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "curriculum_matrix")
public class CurriculumMatrix extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "course_id")
    public Course course;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    public Subject subject;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    public Semester semester;
}
