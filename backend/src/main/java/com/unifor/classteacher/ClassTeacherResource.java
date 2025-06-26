package com.unifor.classteacher;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

import com.unifor.classgroup.ClassGroup;
import com.unifor.classteacher.ClassTeacher;
import com.unifor.classteacher.dto.ClassTeacherDTO;
import com.unifor.curriculum.CurriculumMatrix;
import com.unifor.service.KeycloakService;

@Path("/class-teachers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class ClassTeacherResource {
    @Inject
    KeycloakService keycloakService;

    @GET
    @Path("/class/{classId}/with-users")
    @RolesAllowed({"admin", "coordenador"})
    public List<ClassTeacherDTO> listWithUsers(@PathParam("classId") Long classId) {
        List<ClassTeacher> links = ClassTeacher.list("classGroup.id", classId);

        return links.stream().map(link -> {
            ClassTeacherDTO dto = new ClassTeacherDTO();
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
     @RolesAllowed({"admin", "coordenador"})
    public List<ClassTeacherDTO> listAllWithUsers() {
        List<ClassTeacher> list = ClassTeacher.listAll();

        return list.stream().map(cs -> {
            ClassTeacherDTO dto = new ClassTeacherDTO();
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
    @RolesAllowed({"admin", "coordenador", "professor"})
    public Response getTeacherByUserId(@PathParam("userId") String userId) {
        List<ClassTeacher> list = ClassTeacher.find("userId", userId).list();

        if (list.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<ClassTeacherDTO> dtos = list.stream().map(cs -> {
            ClassTeacherDTO dto = new ClassTeacherDTO();
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

    @GET
    @RolesAllowed({"admin", "coordenador"})
    public List<ClassTeacher> list() {
        return ClassTeacher.listAll();
    }

    @POST
    @Transactional
    @RolesAllowed({"admin", "coordenador"})
    public ClassTeacher create(ClassTeacher classTeacher) {
        classTeacher.persist();
        return classTeacher;
    }

    @PUT
    @Path("{id}")
    @Transactional
    @RolesAllowed({"admin", "coordenador"})
    public ClassTeacher update(@PathParam("id") Long id, ClassTeacher classTeacher) {
        ClassTeacher existing = ClassTeacher.findById(id);
        if (existing == null) {
            throw new NotFoundException("ClassTeacher not found");
        }
        existing.classGroup = classTeacher.classGroup;
        existing.userId = classTeacher.userId;
        existing.persist();
        return existing;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    @RolesAllowed({"admin", "coordenador"})
    public void delete(@PathParam("id") Long id) {
        ClassTeacher.deleteById(id);
    }
}
