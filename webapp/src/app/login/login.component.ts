import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { CommonMethods } from '../common-methods';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: any
  constructor(
    private _loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9\s]+$")]),
      password: new FormControl('', [Validators.required])
    })
  }

  async login(): Promise<void> {
    let loginFormValue = this.loginFormGroup.value;
    let loginresponse = await lastValueFrom(this._loginService.login(loginFormValue));
    console.log(loginresponse)
    if (!loginresponse.has_error) {
      console.log(loginresponse.has_error)
      CommonMethods.setItem('requestedCustomer',loginresponse.data[0]['customerId']);
      this.router.navigate(["/login/2fa"]);
    } else {
      this.toastrService.error(loginresponse.message)
    }
  }

}
