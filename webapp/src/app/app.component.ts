import { Component } from '@angular/core';
import { CommonMethods } from './common-methods';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webapp';
  token = CommonMethods.getItem('token');

  constructor(
    private _loginService: LoginService
  ) { }

  ngOnInit() {
    this._loginService.isLoggedIn.subscribe((res) => {
      if (res) {
        this.token = CommonMethods.getItem('token');
      }
    })
  }
}
