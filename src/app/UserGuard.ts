import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AccountService} from './services/account.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  private accountService: AccountService;
  private router: Router;

  constructor(accountService: AccountService, router: Router) {
    this.accountService = accountService;
    this.router = router;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.accountService.isAuthenticated().then(authenticated => {
      if (!authenticated) {
        this.accountService.logout();
        this.router.navigate(['']);
        return false;
      }
      return true;
    }, () => {
      this.accountService.logout();
      this.router.navigate(['']);
      return false;
    });
  }
}
