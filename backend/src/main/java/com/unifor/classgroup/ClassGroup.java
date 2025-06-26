package com.unifor.classgroup;

import com.unifor.subject.Subject;
import com.unifor.curriculum.CurriculumMatrix;
import com.unifor.semester.Semester;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "classes")
public class ClassGroup extends PanacheEntity {

    public String name;

    @Column(name = "start_date")
    public LocalDate startDate;

    @Column(name = "end_date")
    public LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "curriculum_matrix_id")
    public CurriculumMatrix curriculumMatrix;

}
