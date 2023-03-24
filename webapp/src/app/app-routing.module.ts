import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginTwoFactorComponent } from './login-two-factor/login-two-factor.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginGuard } from './_guards/login.guard';
import { LogincodeGuard } from './_guards/logincode.guard';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login/2fa/:type', component: LoginTwoFactorComponent, canActivate: [LoginGuard,LogincodeGuard] },
  { path: 'login/2fa', component: LoginTwoFactorComponent, canActivate: [LoginGuard,LogincodeGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [LoginGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
