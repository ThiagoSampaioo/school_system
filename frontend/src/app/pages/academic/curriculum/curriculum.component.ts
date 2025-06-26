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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: `./curriculum.html`,
  styleUrls: ['./curriculum.scss'],
})
export class CurriculumComponent {
   // get  http://localhost:8082/curriculum-matrix

  // criando crud
  username = '';
  curriculums: any[] = [];
  curriculum: any = {};
  courses: any[] = [];
  semesters: any[] = [];
  subjects: any[] = [];

  isMobile = false;
  isLoading = false;
  constructor(private http: HttpClient, private router: Router, private breakpointObserver: BreakpointObserver, private toastr: ToastrService) {
    this.username = KeycloakService.getUsername();
    this.loadCurriculums();
    this.loadCourses();
    this.loadSemesters();
    this.loadSubjects();

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

   // SEMESTERS
  loadSemesters() {
    this.http.get<any[]>('http://localhost:8082/semesters').subscribe({
      next: (data) => (this.semesters = data),
      error: (err) => {
        console.error('Erro ao carregar semestres:', err);
        this.toastr.error('Erro ao carregar semestres.');
      },
    });
  }

  // DISCIPLINAS
  loadSubjects() {
    this.http.get<any[]>('http://localhost:8082/subjects').subscribe({
      next: (data) => (this.subjects = data),
      error: (err) => {
        console.error('Erro ao carregar disciplinas:', err);
        this.toastr.error('Erro ao carregar disciplinas.');
      },
    });
  }

  // CURRICULUMS
  loadCurriculums() {
    this.http.get<any[]>('http://localhost:8082/curriculum-matrix').subscribe({

      next: (data) => (this.curriculums = data, console.log('Matrizes curriculares carregadas:', data)),
      error: (err) => {
        console.error('Erro ao carregar matrizes curriculares:', err);
        this.toastr.error('Erro ao carregar matrizes curriculares.');
      },
    });
  }

 saveCurriculum() {
  this.isLoading = true;
  const payload = {
    course: { id: this.curriculum.courseId },
    semester: { id: this.curriculum.semesterId },
    subject: { id: this.curriculum.subjectId }
  };

  const endpoint = this.curriculum.id
    ? `http://localhost:8082/curriculum-matrix/${this.curriculum.id}`
    : 'http://localhost:8082/curriculum-matrix';

  const request = this.curriculum.id
    ? this.http.put(endpoint, payload)
    : this.http.post(endpoint, payload);

  request.subscribe({
    next: () => {
      this.curriculum = {};
      this.loadCurriculums();
      this.isLoading = false;
      this.toastr.success('Matriz curricular salva com sucesso!');
    },
    error: (err) => {
      console.error('Erro ao salvar matriz curricular:', err);
      this.toastr.error('Erro ao salvar matriz curricular.');
      this.isLoading = false;
    }
  });
}


editCurriculum(c: any) {
  this.curriculum = {
    id: c.id,
    courseId: c.course?.id,
    semesterId: c.semester?.id,
    subjectId: c.subject?.id
  };
}



  cancelEditCurriculum() {
    this.curriculum = {};
  }

  deleteCurriculum(id: number) {
    this.http.delete(`http://localhost:8082/curriculum-matrix/${id}`).subscribe({
      next: () => {
        this.loadCurriculums();
      },
      error: (err) => {
        console.error('Erro ao excluir matriz curricular:', err);
        this.toastr.error('Erro ao excluir matriz curricular.');
      }
    });
  }


}
