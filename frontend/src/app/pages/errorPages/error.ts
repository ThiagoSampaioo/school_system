import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { KeycloakService } from '../../core/keycloak.service';
@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './error.html',
  styleUrls: ['./error.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ErrorPageComponent {
  constructor(private router: Router, private keycloakService: KeycloakService) {

  }

  goHome() {
    if (KeycloakService.isAuthenticated()) {
      this.keycloakService.redirectByRole();
    }
    else {
    this.router.navigateByUrl('/');
  }
}
}
