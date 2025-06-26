package com.unifor.subject;

import com.unifor.course.Course;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "subjects")
public class Subject extends PanacheEntity {

    public String name;

    @Column(name = "description")
    public String description;

    @ManyToOne
    @JoinColumn(name = "course_id")
    public Course course;

    @Column(name = "workload_hours")
    public Integer workloadHours;

    @Column(name = "order_in_matrix")
    public Integer orderInMatrix;

    // Dependências para montagem da matriz
    @ManyToMany
    @JoinTable(name = "subject_prerequisites",
        joinColumns = @JoinColumn(name = "subject_id"),
        inverseJoinColumns = @JoinColumn(name = "prerequisite_id"))
    public List<Subject> prerequisites;
}
