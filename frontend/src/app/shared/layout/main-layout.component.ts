import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../core/keycloak.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'layout-container',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})

export class MainLayoutComponent {
  isSidebarOpen = false;
  username = '';
  role: 'admin' | 'coordenador' | 'professor' | 'aluno' = 'aluno';
  isPc = window.innerWidth >= 768;

  constructor(public keycloakService: KeycloakService,
    private router: Router
  ) {
    this.username = KeycloakService.getUsername();
    this.role = keycloakService.getUserRole();
  }
  isActive(path: string): boolean {
    return this.router.url === path;
  }

  logout() {
    KeycloakService.logout();
  }


  get menu() {
    switch (this.role) {
      case 'admin':
        return [
          { path: '/home/users', label: 'Usuários' },
          { path: '/home/academic/courses', label: 'Cursos' },
          { path: '/home/academic/subjects', label: 'Disciplinas' },
          { path: '/home/academic/semesters', label: 'Semestres' },
          { path: '/home/academic/curriculum', label: 'Matriz Curricular' },
          { path: '/home/academic/classes', label: 'Turmas' },
        ];
      case 'coordenador':
        return [
          { path: '/home/academic/courses', label: 'Cursos' },
          { path: '/home/academic/subjects', label: 'Disciplinas' },
          { path: '/home/academic/semesters', label: 'Semestres' },
          { path: '/home/academic/curriculum', label: 'Matriz Curricular' },
          { path: '/home/academic/classes', label: 'Turmas' },
        ];
      case 'professor':
        return [{ path: '/home/academic/dashboard-teachers', label: 'Painel Professor' }];
      case 'aluno':
      default:
        return [{ path: '/home/academic/dashboard-students', label: 'Painel Aluno' }];
    }
  }
}
