import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from '../../../core/keycloak.service';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: `./semesters.html`,
  styleUrls: ['./semesters.scss'],

})
export class SemestersComponent {
    // get  http://localhost:8082/semesters

  // criando crud
  username = '';
  semesters: any[] = [];
  semester: any = {};

  isMobile = false;
  isLoading = false;
  constructor(private http: HttpClient, private router: Router, private breakpointObserver: BreakpointObserver, private toastr: ToastrService) {
    this.username = KeycloakService.getUsername();
    this.loadSemesters();

    this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    ).subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  logout() {
    KeycloakService.logout();
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

  saveSemester() {
    this.isLoading = true;
    const endpoint = this.semester.id
      ? `http://localhost:8082/semesters/${this.semester.id}`
      : 'http://localhost:8082/semesters';
    const request = this.semester.id
      ? this.http.put(endpoint, this.semester)
      : this.http.post(endpoint, this.semester);

    request.subscribe({
      next: () => {
        this.semester = {};
        this.loadSemesters();
        this.isLoading = false;
        this.toastr.success('Semestre salvo com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao salvar semestre:', err);
        this.toastr.error('Erro ao salvar semestre.');
        this.isLoading = false;
      },
    });
  }

  editSemester(s: any) {
    this.semester = { ...s  };
  }


  cancelEditSemester() {
    this.semester = {};
  }

  deleteSemester(id: number) {
    this.http.delete(`http://localhost:8082/semesters/${id}`).subscribe({
      next: () => {
        this.loadSemesters();
        this.toastr.success('Semestre excluído com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir semestre:', err);
        this.toastr.error('Erro ao excluir semestre.');
      },
    });
  }


}
