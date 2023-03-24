import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { ICustomer } from '../interfaces/customer';
import { IcustomerListOptions } from '../interfaces/IcustomerListOptions';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  selectCustomerToView: Subject<any> = new Subject<any>();
  customerIsDelete: Subject<boolean> = new Subject<boolean>();

  constructor(private _http: HttpClient) { }
  /**
   * Get all customers
   * @param customerListOptions : IcustomerListOptions
   * @returns ApiResponse<ICustomer[]>
   */
  getAllCustomers(customerListOptions: IcustomerListOptions): Observable<ApiResponse<ICustomer[]>> {
    return this._http.post<ApiResponse<ICustomer[]>>(environment.API_BASE_URL + 'selectCustomers', customerListOptions);
  }
  /**
   * Get all customers
   * @param customerListOptions : IcustomerListOptions
   * @returns ApiResponse<ICustomer[]>
   */
  getCustomersById(loggedIdCustomerId: string): Observable<ApiResponse<ICustomer[]>> {
    return this._http.post<ApiResponse<ICustomer[]>>(environment.API_BASE_URL + 'selectCustomerById', {customerId:loggedIdCustomerId});
  }
  /**
   * Add new customer
   * @param reqData : ICustomer
   * @returns ApiResponse<ICustomer>
   */
  addNewCustomers(reqData: ICustomer): Observable<ApiResponse<ICustomer>> {
    return this._http.post<ApiResponse<ICustomer>>(environment.API_BASE_URL + 'insertCustomer', reqData);
  }
  /**
   * Delete A customer
   * @param customerId : number
   * @returns ApiResponse<ICustomer>
   */
  deleteCustomers(customerId: number): Observable<ApiResponse<ICustomer>> {
    return this._http.post<ApiResponse<ICustomer>>(environment.API_BASE_URL + 'deleteCustomer', { customerId: customerId });
  }
  /**
   * Update a customer
   * @param reqData : ICustomer
   * @returns ApiResponse<ICustomer>
   */
  updateCustomers(reqData: ICustomer): Observable<ApiResponse<ICustomer>> {
    return this._http.post<ApiResponse<ICustomer>>(environment.API_BASE_URL + 'updateCustomer', reqData);
  }
  /**
   * Upload image of a customer
   * @param formData : any
   * @returns ApiResponse<any>
   */
  imageUploadCustomers(formData: any): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(environment.API_BASE_URL + 'customer/imageupload', formData);
  }
}
