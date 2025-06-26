import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from '../../../core/keycloak.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: `./subjects.html`,
  styleUrls: ['./subjects.scss']
})
export class SubjectsComponent {

  // get  http://localhost:8082/semesters

  // criando crud
  username = '';
  subjects: any[] = [];
  subject: any = {};
  courses: any[] = [];

  isMobile = false;
  isLoading = false;
  constructor(private http: HttpClient, private router: Router, private breakpointObserver: BreakpointObserver, private toastr: ToastrService) {
    this.username = KeycloakService.getUsername();
    this.loadSubjects();
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

  saveSubject() {
    this.isLoading = true;
    const payload = {
      name: this.subject.name,
      description: this.subject.description,
      workloadHours: this.subject.workloadHours,
      orderInMatrix: this.subject.orderInMatrix,
      course: {
        id: this.subject.courseId
      },
      prerequisites: (this.subject.prerequisites || []).map((id: number) => ({ id }))
    };

    const endpoint = this.subject.id
      ? `http://localhost:8082/subjects/${this.subject.id}`
      : 'http://localhost:8082/subjects';

    const request = this.subject.id
      ? this.http.put(endpoint, payload)
      : this.http.post(endpoint, payload);

    request.subscribe({
      next: () => {
        this.subject = {};
        this.loadSubjects();
        this.isLoading = false;
        this.toastr.success('Disciplina salva com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar disciplina:', err);
        this.toastr.error('Erro ao salvar disciplina.');
        this.isLoading = false;
      },
    });
  }


  editSubject(s: any) {
    this.subject = {
      id: s.id,
      name: s.name,
      description: s.description,
      workloadHours: s.workloadHours,
      orderInMatrix: s.orderInMatrix,
      courseId: s.course?.id,
      prerequisites: (s.prerequisites || []).map((p: any) => p.id)
    };
  }



  cancelEditSubject() {
    this.subject = {};
  }

  deleteSubject(id: number) {
    this.http.delete(`http://localhost:8082/subjects/${id}`).subscribe({
      next: () => {
        this.loadSubjects();
        this.toastr.success('Disciplina excluída com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir disciplina:', err);
        this.toastr.error('Erro ao excluir disciplina.');
      },
    });
  }


}
