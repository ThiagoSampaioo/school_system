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
  templateUrl: `./class.html`,
  styleUrls: ['./class.scss'],

})
export class ClassComponent {
  // get  http://localhost:8082/classes

  // criando crud
  username = '';
  classGroups: any[] = [];
  classGroup: any = {};
  curriculumMatrix: any[] = [];

  classSection: 'menu' | 'crud' | 'vinculo' = 'menu';
  selectedClassId: number | null = null;
  selectedTeacherId: number | null = null;

  teachers: any[] = [];

  selectedClassTeacherId: number | null = null;
  ClassTeachers: any[] = [];

  isMobile = false;
  isLoading = false;
  constructor(private http: HttpClient, private router: Router, private breakpointObserver: BreakpointObserver, private toastr: ToastrService) {
    this.username = KeycloakService.getUsername();
    this.loadClasses();
    this.loadCurriculums();
    this.loadTeachers();
    this.loadClassesTeachers();

    this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    ).subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  logout() {
    KeycloakService.logout();
  }

  // CURRICULUMS
  loadCurriculums() {
    this.http.get<any[]>('http://localhost:8082/curriculum-matrix').subscribe({

      next: (data) => (this.curriculumMatrix = data, console.log('Matrizes curriculares carregadas:', data)),
      error: (err) => {
        console.error('Erro ao carregar matrizes curriculares:', err);
        this.toastr.error('Erro ao carregar matrizes curriculares.');
      },
    });
  }

  // CLASSES
  loadClasses() {
    this.http.get<any[]>('http://localhost:8082/classes').subscribe({
      next: (data) => (this.classGroups = data, console.log('Turmas carregadas:', data)),
      error: (err) => {
        console.error('Erro ao carregar turmas:', err);
        this.toastr.error('Erro ao carregar turmas.');
      },
    });
  }

  saveClassGroup() {

    this.isLoading = true;
    const payload = {
      id: this.classGroup.id,
      name: this.classGroup.name,
      startDate: this.classGroup.startDate,
      endDate: this.classGroup.endDate,
      curriculumMatrix: {
        id: this.classGroup.curriculumMatrixId
      }
    };

    const endpoint = this.classGroup.id
      ? `http://localhost:8082/classes/${this.classGroup.id}`
      : 'http://localhost:8082/classes';

    const request = this.classGroup.id
      ? this.http.put(endpoint, payload)
      : this.http.post(endpoint, payload);

    request.subscribe({
      next: () => {
        this.classGroup = {};
        this.loadClasses();
        this.isLoading = false;
        this.toastr.success('Turma salva com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar turma:', err);
        this.toastr.error('Erro ao salvar turma.');
        this.isLoading = false;
      }
    });
  }

  editClassGroup(c: any) {
    this.classGroup = { ...c };
  }


  cancelEditClassGroup() {
    this.classGroup = {};
  }

  deleteClassGroup(id: number) {
    this.http.delete(`http://localhost:8082/classes/${id}`).subscribe({
      next: () => {
        this.loadClasses();
        this.toastr.success('Turma excluída com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir turma:', err);
        this.toastr.error('Erro ao excluir turma.');
      }
    });
  }


  //Vincular Professor

    loadTeachers() {
    this.http.get<any[]>('http://localhost:8082/users/role/professor').subscribe({
      next: (data) => (this.teachers = data),
      error: (err) => {
        console.error('Erro ao carregar professores:', err);
        this.toastr.error('Erro ao carregar professores.');
      },
    });
  }


vincularProfessor() {
 this.isLoading = true;

  this.http.post('http://localhost:8082/class-teachers', {
    userId: this.selectedTeacherId,
    classGroup: { id: this.selectedClassId }
  }).subscribe({
    next: () => {
      this.toastr.success('Professor vinculado com sucesso!');
      this.loadClassesTeachers(); // atualizar lista
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Erro ao vincular professor à turma:', err);
      this.toastr.error('Erro ao vincular professor.');
      this.isLoading = false;
    }
  });
}

  removerVinculoProfessor(classTeacherId: number) {
    if (confirm('Deseja realmente desvincular este professor da turma?')) {
      this.http.delete(`http://localhost:8082/class-teachers/${classTeacherId}`).subscribe({
        next: () => {
          this.toastr.success('Professor desvinculado com sucesso!');
          this.loadClassesTeachers(); // Atualizar lista de turmas
        },
        error: (err) => {
          console.error('Erro ao desvincular professor da turma:', err);
          this.toastr.error('Erro ao desvincular professor.');
        }
      });
    }
  }

    //ClassTeachers
  loadClassesTeachers() {
    this.http.get<any[]>('http://localhost:8082/class-teachers/with-users').subscribe({
      next: (data) => (this.ClassTeachers = data, console.log('Professores por turma:', data)),
      error: (err) => {
        console.error('Erro ao carregar professores por turma:', err);
        this.toastr.error('Erro ao carregar professores por turma.');
      },
    });
  }

}
