import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonMethods } from '../common-methods';
import { Router } from '@angular/router';

@Injectable()
export class WebInterceptor implements HttpInterceptor {

  constructor(private _toastr: ToastrService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var headerValues: any = {};
    //headerValues['Content-Type'] = 'application/json';
    let token = CommonMethods.getItem('token');
    if (token && token != '') {
      headerValues['token'] = token;
    }

    request = request.clone({
      setHeaders: headerValues,
      method: request.method
    });
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMsg = '';
        if (err.status == 0) {
          if (err.error instanceof ProgressEvent) {
            errorMsg = `Error: Unable to connect server.`;
          } else {
            errorMsg = `Error Code: ${err.status},  Message: ${err.message}`;
          }
        } else if (err.status == 403) {
          errorMsg = `Error Code: ${err.status},  Message: Unauthorized Access`;
          CommonMethods.removeItem('token');
          CommonMethods.removeItem('role');
          CommonMethods.removeItem('customerId');
          window.location.reload();
        } else {
          errorMsg = 'Unknown Error';
          if (typeof err.error === "object") {
            if (err.error.message) {
              if (typeof err.error.message == 'object') {
                this._toastr.error(err.error.message.error);
              } else {
                this._toastr.error(err.error.message);
              }
            } else {
              for (var key in err.error) {
                for (var errVal of err.error[key]) {
                  this._toastr.error(errVal['message']);
                }
              }
            }
          } else {
            var error = JSON.parse(err.error);
            if (typeof error === "object") {
              for (var key in error) {
                for (var i = 0; i < error[key].length; i++) {
                  this._toastr.error(`${error[key][i]}`);
                }
              }
            } else {
              this._toastr.error(error);
            }
          }
        }
        this._toastr.error(errorMsg);
        return throwError(() => new Error(errorMsg));
      }),
      finalize(() => {
        // Fineal Code
      })
    );
  }
}
