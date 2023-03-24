import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { CommonMethods } from '../common-methods';
import { ApiResponse } from '../interfaces/api-response';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  constructor(
    private toastrService: ToastrService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async forgotPassword(): Promise<void> {
    var res: ApiResponse<any> = await lastValueFrom(this.loginService.forgotPassword(this.email));
    if (!res.has_error) {
      this.toastrService.success(res.message);
      CommonMethods.setItem('requestedCustomer', res.data[0]['customerId']);
      this.router.navigate(["/login/2fa",'reset']);
    } else {
      this.toastrService.error(res.message);
    }
  }

}
