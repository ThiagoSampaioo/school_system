package com.unifor.semester;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "semesters")
public class Semester extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    @Column(nullable = false)
    public int year;

    @Column(nullable = false)
    public boolean active = true;
}
