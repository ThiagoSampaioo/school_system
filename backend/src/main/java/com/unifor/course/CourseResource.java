package com.unifor.course;

import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/courses")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"admin", "coordenador"})
public class CourseResource {

    @GET
    public List<Course> list() {
        return Course.listAll();
    }

    @POST
    @Transactional
    public Course create(Course course) {
        course.persist();
        return course;
    }

    @PUT
    @Path("{id}")
    @Transactional
    public Course update(@PathParam("id") Long id, Course updated) {
        Course course = Course.findById(id);
        if (course == null) {
            throw new NotFoundException();
        }
        course.name = updated.name;
        course.description = updated.description;
        return course;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Course.deleteById(id);
    }
}
