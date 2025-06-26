package com.unifor.classstudent;

import com.unifor.classgroup.ClassGroup;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "class_students")
public class ClassStudent extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "class_id")
    public ClassGroup classGroup;

    @Column(name = "user_id")
    public String userId;  // UUID Keycloak


}
