import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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
import { KeycloakService } from '../../core/keycloak.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DashboardComponent {
  username = '';

  selectedSection: 'menu' | 'students' | 'teachers' | 'coordinators' = 'menu';
  studentSubsection: 'studentCrud' | 'studentClassLink' | null = null;

  student: any = {};
  students: any[] = [];

  teacher: any = {};
  teachers: any[] = [];

  coordinator: any = {};
  coordinators: any[] = [];

  selectedStudentId: string | undefined;
  selectedClassId: number | undefined;
  classes: any[] = [];

  classStudent: any = {}
  ClassStudents: any[] = []

  isMobile = false;
  isLoading = false;
  constructor(private http: HttpClient, private router: Router, private breakpointObserver: BreakpointObserver, private toastr: ToastrService) {
    this.username = KeycloakService.getUsername();

    this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    ).subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  logout() {
    KeycloakService.logout();
  }

  goBack() {
  if (this.studentSubsection) {
    this.studentSubsection = null;
  } else {
    this.selectedSection = 'menu';
  }
}


  selectSection(section: 'students' | 'teachers' | 'coordinators' | 'menu') {
    this.selectedSection = section;
    this.studentSubsection = null;

    if (section === 'students') {
      this.loadStudents();
      this.loadClasses();
      this.loadClassesStudents();
    }
    if (section === 'teachers') this.loadTeachers();
    if (section === 'coordinators') this.loadCoordinators();
  }

  //ClassStudents
  loadClassesStudents() {
    this.http.get<any[]>('http://localhost:8082/class-students/with-users').subscribe({
      next: (data) => (this.ClassStudents = data),
      error: (err) => {
        console.error('Erro ao carregar alunos por turma:', err);
        this.toastr.error('Erro ao carregar alunos por turma.');
      },
    });
  }
  vincularAluno() {
    this.isLoading = true;

    this.http.post('http://localhost:8082/class-students', {
      userId: this.selectedStudentId,
      classGroup: { id: this.selectedClassId }
    }).subscribe({
      next: () => {
        this.toastr.success('Aluno vinculado com sucesso!');
        this.loadClassesStudents(); // atualizar lista
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao vincular aluno à turma:', err);
        this.toastr.error('Erro ao vincular aluno.');
        this.isLoading = false;
      }
    });
  }



removerVinculoAluno(classStudentId: number) {
  if (confirm('Deseja realmente desvincular este aluno da turma?')) {
    this.http.delete(`http://localhost:8082/class-students/${classStudentId}`).subscribe({
      next: () => {
        this.toastr.success('Aluno desvinculado com sucesso!');
        this.loadClassesStudents();
      },
      error: (err) => {
        console.error('Erro ao desvincular aluno da turma:', err);
        this.toastr.error('Erro ao desvincular aluno.');
      }
    });
  }
}


  // STUDENTS
  loadStudents() {
    this.http.get<any[]>('http://localhost:8082/users/role/aluno').subscribe({
      next: (data) => (this.students = data),
      error: (err) => {
        console.error('Erro ao carregar alunos:', err);
        this.toastr.error('Erro ao carregar alunos.');
      },
    });
  }

  saveStudent() {
    this.isLoading = true;
    const endpoint = this.student.id
      ? `http://localhost:8082/users/${this.student.id}`
      : 'http://localhost:8082/users/with-role/aluno';

    const request = this.student.id
      ? this.http.put(endpoint, this.student)
      : this.http.post(endpoint, this.student);

    request.subscribe({
      next: () => {
        this.student = {};
        this.loadStudents();
        this.toastr.success('Aluno salvo com sucesso!');
        this.isLoading = false;
        this.cancelEditStudent(); // Limpa o formulário após salvar
      },
      error: (err) => {
        console.error('Erro ao salvar aluno:', err);
        this.toastr.error('Erro ao salvar aluno.');
        this.isLoading = false;
    }
    });
  }

  editStudent(s: any) {
    this.student = { ...s };
  }

  cancelEditStudent() {
    this.student = {};
  }

  // VINCULAR ALUNO À TURMA
  loadClasses() {
    this.http.get<any[]>('http://localhost:8082/classes').subscribe({
      next: (data) => (this.classes = data),
      error: (err) => console.error('Erro ao carregar turmas:', err)
    });
  }



  // TEACHERS
  loadTeachers() {
    this.http.get<any[]>('http://localhost:8082/users/role/professor').subscribe({
      next: (data) => (this.teachers = data),
      error: (err) => {
        console.error('Erro ao carregar professores:', err);
        alert('Erro ao carregar professores.');
      },
    });
  }

  saveTeacher() {
    this.isLoading = true;

    const endpoint = this.teacher.id
      ? `http://localhost:8082/users/${this.teacher.id}`
      : 'http://localhost:8082/users/with-role/professor';

    const request = this.teacher.id
      ? this.http.put(endpoint, this.teacher)
      : this.http.post(endpoint, this.teacher);

    request.subscribe({
      next: () => {
        this.teacher = {};
        this.loadTeachers();
        this.toastr.success('Professor salvo com sucesso!');
        this.cancelEditTeacher(); // Limpa o formulário após salvar
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao salvar professor:', err);
        this.toastr.error('Erro ao salvar professor.');
        this.isLoading = false;
      }
    });
  }

  editTeacher(t: any) {
    this.teacher = { ...t };
  }

  cancelEditTeacher() {
    this.teacher = {};
  }

  // COORDINATORS
  loadCoordinators() {
    this.http.get<any[]>('http://localhost:8082/users/role/coordenador').subscribe({
      next: (data) => (this.coordinators = data),
      error: (err) => {
        console.error('Erro ao carregar coordenadores:', err);
        this.toastr.error('Erro ao carregar coordenadores.');
      },
    });
  }

  saveCoordinator() {
    this.isLoading = true;

    const endpoint = this.coordinator.id
      ? `http://localhost:8082/users/${this.coordinator.id}`
      : 'http://localhost:8082/users/with-role/coordenador';

    const request = this.coordinator.id
      ? this.http.put(endpoint, this.coordinator)
      : this.http.post(endpoint, this.coordinator);

    request.subscribe({
      next: () => {
        this.coordinator = {};
        this.loadCoordinators();
        this.toastr.success('Coordenador salvo com sucesso!');
        this.isLoading = false;
        this.cancelEditCoordinator(); // Limpa o formulário após salvar
      },
      error: (err) => {
        console.error('Erro ao salvar coordenador:', err);
        this.toastr.error('Erro ao salvar coordenador.');
        this.isLoading = false;
      }
    });
  }

  editCoordinator(c: any) {
    this.coordinator = { ...c };
  }

  cancelEditCoordinator() {
    this.coordinator = {};
  }

  // DELETE USER
  deleteUser(id: number) {
    if (confirm('Deseja realmente excluir este usuário?')) {
      this.http.delete(`http://localhost:8082/users/${id}`).subscribe({
        next: () => {
          this.loadTeachers();
          this.loadStudents();
          this.loadCoordinators();
          this.toastr.success('Usuário excluído com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao excluir usuário:', err);
          this.toastr.error('Erro ao excluir usuário.');
        },
      });
    }
  }
}
