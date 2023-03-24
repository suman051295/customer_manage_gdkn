import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn: Subject<boolean> = new Subject<boolean>();

  constructor(private _http: HttpClient) { }
  /**
   * Login
   * @param reqData :any
   * @returns 
   */
  login(reqData: any): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(environment.API_BASE_URL + 'login', reqData);
  }

  /**
   * Login with code
   * @param logincode : string | number
   * @param requestedCustomerId : string
   * @returns 
   */
  loginWithCode(logincode: string | number, requestedCustomerId: string): Observable<ApiResponse<any>> {
    let reqData = { "logincode": logincode, "requestedCustomerId": requestedCustomerId };
    return this._http.post<ApiResponse<any>>(environment.API_BASE_URL + 'login/code', reqData);
  }

  /**
   * Forgot Password
   * @param email :string
   * @returns 
   */
  forgotPassword(email: string): Observable<ApiResponse<any>> {
    let reqData = { "email": email};
    return this._http.post<ApiResponse<any>>(environment.API_BASE_URL + 'login/forgotpassword', reqData);
  }

  resetPassword(reqData: any): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(environment.API_BASE_URL + 'login/resetPassword', reqData);
  }
}
