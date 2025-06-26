import { Component, OnInit } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from '../../../core/keycloak.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSelectModule],
  templateUrl: `./dashboard.html`,
  styleUrls: ['./dashboard.scss'],

})
export class StudentDashboardComponent implements OnInit {
  userId: string = '';
  studentInfo: any[] = [];
  loading = true;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Substitua isso com a forma como você recupera o ID do usuário
    this.userId = KeycloakService.getUserId();
    if (!this.userId) {
      console.error('Usuário não autenticado ou ID do usuário não encontrado.');
      this.loading = false;
      this.error = true;
      return;
    }
    this.getStudentInfo();
  }

  getStudentInfo() {
    this.http.get<any[]>(`http://localhost:8082/class-students/with-users/${this.userId}`).subscribe({
      next: (res) => {
        this.studentInfo = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar informações do estudante:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }
}
