import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { CommonMethods } from '../common-methods';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  restFormGroup: any;
  constructor(
    private _loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.restFormGroup = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    })
  }

  async reset(): Promise<void> {
    if (this.restFormGroup.value.password == this.restFormGroup.value.confirmPassword) {
      let fromValue = { password: this.restFormGroup.value.password, customerId: CommonMethods.getItem('requestedCustomer') };
      let res = await lastValueFrom(this._loginService.resetPassword(fromValue));
      console.log(res)
      if (!res.has_error) {
        console.log(res.has_error)
        this.toastrService.success(res.message);
        CommonMethods.removeItem('requestedCustomer');
        this.router.navigate(["/"]);
      } else {
        this.toastrService.error(res.message)
      }
    }

  }

}
