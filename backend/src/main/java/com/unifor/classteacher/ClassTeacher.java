package com.unifor.classteacher;

import com.unifor.classgroup.ClassGroup;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "class_teachers")
public class ClassTeacher extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "class_id")
    public ClassGroup classGroup;

    @Column(name = "user_id")
    public String userId; // UUID Keycloak
}
