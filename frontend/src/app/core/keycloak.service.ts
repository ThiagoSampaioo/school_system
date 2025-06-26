import Keycloak from 'keycloak-js';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  static keycloak: Keycloak;
  constructor(private router: Router) {
    if (!KeycloakService.keycloak) {
      throw new Error('KeycloakService not initialized. Call init() first.');
    }
  }

  redirectByRole(): void {
    const roles = KeycloakService.keycloak?.realmAccess?.roles || [];
    if (!KeycloakService.isAuthenticated()) return;

    if (roles.includes('admin')) {
      this.router.navigateByUrl('/home/users');
    } else if (roles.includes('coordenador')) {
      this.router.navigateByUrl('/home/academic/courses');
    } else if (roles.includes('professor')) {
      this.router.navigateByUrl('/home/academic/dashboard-teachers');
    } else if (roles.includes('aluno')) {
      this.router.navigateByUrl('/home/academic/dashboard-students');
    } else {
      // this.router.navigateByUrl('/unauthorized');
    }
  }


  static init(): Promise<void> {
    KeycloakService.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'school-system',
      clientId: 'frontend',
    });

    return KeycloakService.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      redirectUri: window.location.href,
    }).then(authenticated => {
      console.log('Autenticado?', authenticated);
    }).catch(err => {
      console.error('Erro ao iniciar Keycloak:', err);
      return Promise.reject(err);
    });
  }



  static login(): void {
    KeycloakService.keycloak.login({
      redirectUri: 'http://localhost:4200/home'
    });
  }

  static logout(): void {
    KeycloakService.keycloak.logout({
      redirectUri: 'http://localhost:4200'
    }).then(() => {
      window.location.href = 'http://localhost:4200';
    }).catch(err => {
      window.location.href = 'http://localhost:4200';
    });
  }

  static isAuthenticated(): boolean {
    return KeycloakService.keycloak?.authenticated || false;
  }

  static getToken(): string {
    return KeycloakService.keycloak?.token || '';
  }

  static getUsername(): string {
    const parsed = KeycloakService.keycloak?.tokenParsed as Record<string, any>;
    return parsed?.['preferred_username'] || parsed?.['email'] || '';
  }

  static getUserId(): string {
    const parsed = KeycloakService.keycloak?.tokenParsed as Record<string, any>;
    return parsed?.['sub'] || '';
  }




  static hasRole(role: string): boolean {
    const roles = KeycloakService.keycloak?.realmAccess?.roles;
    return Array.isArray(roles) && roles.includes(role);
  }

  static hasAnyRole(roles: string[]): boolean {
    const userRoles = KeycloakService.keycloak?.realmAccess?.roles || [];
    return roles.some(role => userRoles.includes(role));
  }


  getUserRole(): 'admin' | 'coordenador' | 'professor' | 'aluno' {
    const roles = KeycloakService.keycloak?.realmAccess?.roles || [];
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('coordenador')) return 'coordenador';
    if (roles.includes('professor')) return 'professor';
    if (roles.includes('aluno')) return 'aluno';
    return 'aluno'; // Padrão para aluno se nenhuma role for encontrada
  }


}

setInterval(() => {
  KeycloakService.keycloak.updateToken(30).then((refreshed) => {
    if (refreshed) {
      console.log('Token renovado!');
    }
  }).catch(() => {
    console.error('Erro ao renovar token. Fazendo logout...');
    KeycloakService.logout();
  });// acada 29 minutos, renova o token e verifica se houve erro. Se sim, faz logout.
}, 1740000); // 29 minutos em milissegundos

