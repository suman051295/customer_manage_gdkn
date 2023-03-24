import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { CommonMethods } from '../common-methods';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login-two-factor',
  templateUrl: './login-two-factor.component.html',
  styleUrls: ['./login-two-factor.component.css']
})
export class LoginTwoFactorComponent implements OnInit {
  logincode: string | number;
  type: string = '';
  constructor(
    private _loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type');
  }

  async loginWithCode(): Promise<void> {
    let requestedCustomerId = CommonMethods.getItem('requestedCustomer');
    let loginresponse = await lastValueFrom(this._loginService.loginWithCode(this.logincode, requestedCustomerId));
    if (!loginresponse.has_error) {
      if (this.type && this.type == 'reset') {
        this.router.navigateByUrl("/reset-password");
      } else {
        CommonMethods.removeItem('requestedCustomer');
        CommonMethods.setItem('token', loginresponse.data.token);
        CommonMethods.setItem('role', loginresponse.data.role);
        CommonMethods.setItem('customerId', loginresponse.data.customerId);
        this._loginService.isLoggedIn.next(true);
        this.router.navigateByUrl("/dashboard");
      }

    } else {
      this.toastrService.error(loginresponse.message)
    }
  }

}
