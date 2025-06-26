
import { KeycloakService } from '../../core/keycloak.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, MatCardModule, MatDividerModule, MatRippleModule, RouterModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
   animations: [
    trigger('fadeInStagger', [
      transition(':enter', [
        query('.feature-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]

})



export class LandingComponent {
    features = [
  {
    icon: 'school',
    title: 'Corpo Docente Qualificado',
    description: 'Professores experientes com forte atuação no mercado e na pesquisa.',
  },
  {
    icon: 'laptop_mac',
    title: 'Infraestrutura Moderna',
    description: 'Laboratórios, biblioteca digital e salas climatizadas com tecnologia de ponta.',
  },
  {
    icon: 'public',
    title: 'Conexão com o Mercado',
    description: 'Parcerias estratégicas com empresas para estágios, inovação e intercâmbios.',
  },
];
  login() {
    KeycloakService.login();
  }

  logout() {
    KeycloakService.logout();
  }

  isAuthenticated(): boolean {
    return KeycloakService.isAuthenticated();
  }

  get username(): string {
    return KeycloakService.getUsername();
  }

}
