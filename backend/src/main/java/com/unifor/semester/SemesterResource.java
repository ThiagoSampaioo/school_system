package com.unifor.semester;

import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/semesters")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"admin", "coordenador"})
public class SemesterResource {

    @GET
    public List<Semester> list() {
        return Semester.listAll();
    }

    @POST
    @Transactional
    public Semester create(Semester semester) {
        semester.persist();
        return semester;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Semester update(@PathParam("id") Long id, Semester updated) {
        Semester semester = Semester.findById(id);
        if (semester == null) throw new NotFoundException();
        semester.name = updated.name;
        semester.year = updated.year;
        semester.active = updated.active;
        return semester;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Semester.deleteById(id);
    }
}
