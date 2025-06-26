import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { KeycloakService } from './core/keycloak.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'School System';

  constructor(private keycloakService: KeycloakService, private router: Router) { }
  ngOnInit(): void {

      if (KeycloakService.isAuthenticated() && window.location.pathname === '/home') {
       this.keycloakService.redirectByRole();
      } else {
        if(window.location.pathname !== '/' && !KeycloakService.isAuthenticated()) this.router.navigate(['/error']);
      }

  }

}
