import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonMethods } from '../common-methods';

@Injectable({
  providedIn: 'root'
})
export class LogincodeGuard implements CanActivate {
  constructor(private _router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let token = CommonMethods.getItem('requestedCustomer');
      if (!token || token == '') {
        this._router.navigate(["/"]);
        return false;
      }
      return true;
  }
  
}
