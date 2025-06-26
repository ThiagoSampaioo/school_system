package com.unifor.classgroup;

import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

import com.unifor.classgroup.dto.ClassGroupCurriculumDTO;
import com.unifor.curriculum.CurriculumMatrix;
import com.unifor.subject.Subject;

@Path("/classes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

@RolesAllowed({ "admin", "coordenador" })
public class ClassGroupResource {

    @GET
    public List<ClassGroup> list() {
        return ClassGroup.listAll();
    }

    @POST
    @Transactional
    public ClassGroup create(ClassGroup classGroup) {
        classGroup.persist();
        return classGroup;
    }

    @PUT
    @Path("{id}")
    @Transactional
    public ClassGroup update(@PathParam("id") Long id, ClassGroup updated) {
        ClassGroup classGroup = ClassGroup.findById(id);
        if (classGroup == null) {
            throw new NotFoundException("Turma não encontrada");
        }

        classGroup.name = updated.name;
        classGroup.startDate = updated.startDate;
        classGroup.endDate = updated.endDate;
        classGroup.curriculumMatrix = updated.curriculumMatrix;

        return classGroup;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        boolean deleted = ClassGroup.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("Turma não encontrada");
        }
    }

    @GET
    @Path("{id}/curriculum")
    public ClassGroupCurriculumDTO getCurriculumByClassGroup(@PathParam("id") Long id) {
        ClassGroup classGroup = ClassGroup.findById(id);
        if (classGroup == null || classGroup.curriculumMatrix == null) {
            throw new NotFoundException("Turma ou matriz curricular não encontrada");
        }

        Long courseId = classGroup.curriculumMatrix.course.id;
        Long semesterId = classGroup.curriculumMatrix.semester.id;

        List<CurriculumMatrix> curriculumList = CurriculumMatrix.find(
                "course.id = ?1 and semester.id = ?2", courseId, semesterId).list();

        List<Subject> subjects = curriculumList.stream()
                .map(cm -> cm.subject)
                .distinct()
                .toList();

        return new ClassGroupCurriculumDTO(classGroup, subjects);
    }

}
