import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './ui-elements/header/header.component';
import { FooterComponent } from './ui-elements/footer/footer.component';
import { LeftBarComponent } from './ui-elements/left-bar/left-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebInterceptor } from './services/web.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from './ui-elements/pagination/pagination.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginTwoFactorComponent } from './login-two-factor/login-two-factor.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LeftBarComponent,
    DashboardComponent,
    PaginationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    LoginTwoFactorComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: WebInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
