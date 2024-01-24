import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './services/auth.service';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.isAuthenticated().pipe(map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        // open login dialog
        this.openLoginDialog();
        return false;
      }
    }));
  }


  private openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      // You can add other configuration options here
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/supersecrettickets']);
    });
  }
}
