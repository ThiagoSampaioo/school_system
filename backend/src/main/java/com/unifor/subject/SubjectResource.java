package com.unifor.subject;

import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/subjects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"admin", "coordenador"})
public class SubjectResource {

    @GET
    public List<Subject> list() {
        return Subject.listAll();
    }

    @POST
    @Transactional
    public Subject create(Subject subject) {
        subject.persist();
        return subject;
    }

    @PUT
    @Path("{id}")
    @Transactional
    public Subject update(@PathParam("id") Long id, Subject updated) {
        Subject subject = Subject.findById(id);
        if (subject == null) {
            throw new NotFoundException();
        }
        subject.name = updated.name;
        subject.description = updated.description;
        subject.workloadHours = updated.workloadHours;
        subject.orderInMatrix = updated.orderInMatrix;
        subject.course = updated.course;
        subject.prerequisites = updated.prerequisites;
        return subject;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Subject.deleteById(id);
    }
}
