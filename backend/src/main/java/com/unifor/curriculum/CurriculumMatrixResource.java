package com.unifor.curriculum;

import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/curriculum-matrix")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"admin", "coordenador"})
public class CurriculumMatrixResource {

    @GET
    public List<CurriculumMatrix> list() {
        return CurriculumMatrix.listAll();
    }

    @POST
    @Transactional
    public CurriculumMatrix create(CurriculumMatrix matrix) {
        matrix.persist();
        return matrix;
    }

    @PUT
    @Path("{id}")
    @Transactional
    public CurriculumMatrix update(@PathParam("id") Long id, CurriculumMatrix updated) {
        CurriculumMatrix matrix = CurriculumMatrix.findById(id);
        if (matrix == null) {
            throw new NotFoundException();
        }

        matrix.course = updated.course;
        matrix.subject = updated.subject;
        matrix.semester = updated.semester;
        return matrix;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        CurriculumMatrix.deleteById(id);
    }
}
