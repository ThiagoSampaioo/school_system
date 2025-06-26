package com.unifor.course;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course extends PanacheEntity {

    public String name;

    @Column(name = "description")
    public String description;

}
