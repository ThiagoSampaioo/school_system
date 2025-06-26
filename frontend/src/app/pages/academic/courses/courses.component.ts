import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { KeycloakService } from '../../../core/keycloak.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: `./courses.html`,
  styleUrls: ['./courses.scss']
})

export class CoursesComponent {
  // get  http://localhost:8082/courses

  // criando crud
  username = '';
  courses: any[] = [];
  course: any = {};

  isMobile = false;
  isLoading = false;
  constructor(private http: HttpClient, private router: Router, private breakpointObserver: BreakpointObserver, private toastr: ToastrService) {
    this.username = KeycloakService.getUsername();
    this.loadCourses();

    this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    ).subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  logout() {
    KeycloakService.logout();
  }



  // COURSES
  loadCourses() {
    this.http.get<any[]>('http://localhost:8082/courses').subscribe({

      next: (data) => (this.courses = data),
      error: (err) => {
        console.error('Erro ao carregar cursos:', err);
        this.toastr.error('Erro ao carregar cursos.');
      },
    });
  }

  saveCourse() {
    this.isLoading = true;
    const endpoint = this.course.id
      ? `http://localhost:8082/courses/${this.course.id}`
      : 'http://localhost:8082/courses';
    const request = this.course.id
      ? this.http.put(endpoint, this.course)
      : this.http.post(endpoint, this.course);

    request.subscribe({
      next: () => {
        this.course = {};
        this.loadCourses();
        this.isLoading = false;
        this.toastr.success('Curso salvo com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar curso:', err);
        this.toastr.error('Erro ao salvar curso.');
        this.isLoading = false;
      },

    });
  }

  editCourse(c: any) {
    this.course = { ...c };
  }


  cancelEditCourse() {
    this.course = {};
  }

  deleteCourse(id: number) {
    this.http.delete(`http://localhost:8082/courses/${id}`).subscribe({
      next: () => {
        this.loadCourses();
        this.toastr.success('Curso excluído com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir curso:', err);
        this.toastr.error('Erro ao excluir curso.');
      },
    });
  }


}
