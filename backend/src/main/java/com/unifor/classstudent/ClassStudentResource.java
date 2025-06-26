package com.unifor.classstudent;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

import com.unifor.classgroup.ClassGroup;
import com.unifor.classstudent.dto.ClassStudentDTO;
import com.unifor.curriculum.CurriculumMatrix;
import com.unifor.service.KeycloakService;

@Path("/class-students")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClassStudentResource {
    
    @Inject
    KeycloakService keycloakService;
    
    @GET
    @Path("/class/{classId}/with-users")
    @RolesAllowed("admin")
    public List<ClassStudentDTO> listWithUsers(@PathParam("classId") Long classId) {
        List<ClassStudent> links = ClassStudent.list("classGroup.id", classId);

        return links.stream().map(link -> {
            ClassStudentDTO dto = new ClassStudentDTO();
            dto.id = link.id;
            dto.classId = link.classGroup.id;
            dto.userId = link.userId;

            keycloakService.getUserById(String.valueOf(link.userId)).ifPresent(user -> {
                dto.firstName = (String) user.get("firstName");
                dto.lastName = (String) user.get("lastName");
                dto.email = (String) user.get("email");
            });

            return dto;
        }).collect(Collectors.toList());
    }

    @GET
    @Path("/with-users")
    @RolesAllowed("admin")
    public List<ClassStudentDTO> listAllWithUsers() {
        List<ClassStudent> list = ClassStudent.listAll();

        return list.stream().map(cs -> {
            ClassStudentDTO dto = new ClassStudentDTO();
            dto.id = cs.id;
            dto.classId = cs.classGroup.id;
            dto.userId = cs.userId;
            keycloakService.getUserById(String.valueOf(cs.userId)).ifPresent(user -> {
                dto.firstName = (String) user.get("firstName");
                dto.lastName = (String) user.get("lastName");
                dto.email = (String) user.get("email");
            });
            // Dados da turma
            ClassGroup cg = cs.classGroup;
            dto.classId = cg.id;
            dto.className = cg.name;
            dto.startDate = cg.startDate;
            dto.endDate = cg.endDate;

            // Dados da matriz
            CurriculumMatrix matrix = cg.curriculumMatrix;
            dto.curriculumId = matrix.id;
            dto.semesterName = matrix.semester.name;
            dto.courseName = matrix.course.name;
            return dto;
        }).collect(Collectors.toList());
    }

    @GET
    @Path("/with-users/{userId}")
    @RolesAllowed({"admin", "aluno"})
    public Response getStudentByUserId(@PathParam("userId") String userId) {
        List<ClassStudent> list = ClassStudent.find("userId", userId).list();

        if (list.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<ClassStudentDTO> dtos = list.stream().map(cs -> {
            ClassStudentDTO dto = new ClassStudentDTO();
            dto.id = cs.id;
            dto.classId = cs.classGroup.id;
            dto.userId = cs.userId;

            keycloakService.getUserById(userId).ifPresent(user -> {
                dto.firstName = (String) user.get("firstName");
                dto.lastName = (String) user.get("lastName");
                dto.email = (String) user.get("email");
            });

            // Dados da turma
            ClassGroup cg = cs.classGroup;
            dto.className = cg.name;
            dto.startDate = cg.startDate;
            dto.endDate = cg.endDate;

            // Dados da matriz
            CurriculumMatrix matrix = cg.curriculumMatrix;
            dto.curriculumId = matrix.id;
            dto.semesterName = matrix.semester.name;
            dto.courseName = matrix.course.name;

            return dto;
        }).toList();

        return Response.ok(dtos).build();
    }

    @POST
    @Transactional
    @RolesAllowed("admin")
    public ClassStudent create(ClassStudent classStudent) {
        classStudent.persist();
        return classStudent;
    }

    @PUT
    @Path("{id}")
    @Transactional
    @RolesAllowed("admin")
    public ClassStudent update(@PathParam("id") Long id, ClassStudent classStudent) {
        ClassStudent existing = ClassStudent.findById(id);
        if (existing == null) {
            throw new NotFoundException("ClassStudent not found");
        }
        existing.classGroup = classStudent.classGroup;
        existing.userId = classStudent.userId;
        existing.persist();
        return existing;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    @RolesAllowed("admin")
    public void delete(@PathParam("id") Long id) {
        ClassStudent.deleteById(id);
    }

}
