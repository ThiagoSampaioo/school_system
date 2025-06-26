// multiRole.guard.ts
import { CanActivateFn } from '@angular/router';
import { KeycloakService } from './keycloak.service';

export function hasAnyRole(roles: string[]): CanActivateFn {
  return () => KeycloakService.hasAnyRole(roles);
}
