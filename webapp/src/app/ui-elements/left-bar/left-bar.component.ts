import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { ICustomer } from 'src/app/interfaces/customer';
import { IcustomerListOptions } from 'src/app/interfaces/IcustomerListOptions';
import { environment } from 'src/environments/environment';
import { CustomerService } from '../../services/customer.service';

@Component({
	selector: 'app-left-bar',
	templateUrl: './left-bar.component.html',
	styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {
	firstState: boolean = true;
	loginDetailsForm: any;
	profileDetailsForm: any;
	@ViewChild('closebutton') closebutton;
	customers: ICustomer[] = [];
	activeCustomerId: number;
	totalRecords: number = 0;
	customerListOptions: IcustomerListOptions = {
		startIndex: 0,
		pageSize: 5,
		free_search_text: ''
	}
	fileData: File;

	constructor(
		private _customerService: CustomerService,
		private _toastrService: ToastrService
	) { }

	ngOnInit(): void {
		this.getCustomers();
		this.loginDetailsForm = new FormGroup({
			userName: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9\s]+$")]),
			firstName: new FormControl('', [Validators.required, Validators.pattern("[a-z A-Z\s]+$")]),
			lastName: new FormControl('', [Validators.required, Validators.pattern("[a-z A-Z\s]+$")]),
			email: new FormControl('', [Validators.required, Validators.email]),
			phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern("[0-9]{10}")]),
			dob: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
			confirmPassword: new FormControl('', [Validators.required]),
		})

		this.profileDetailsForm = new FormGroup({
			address: new FormControl('', [Validators.required]),
			landmark: new FormControl('', [Validators.required]),
			city: new FormControl('', [Validators.required]),
			state: new FormControl('', [Validators.required]),
			country: new FormControl('', [Validators.required]),
			zipcode: new FormControl('', [Validators.required]),
			gender: new FormControl('', [Validators.required])
		})
		/** Subscribe a customer delete subject */
		this._customerService.customerIsDelete.subscribe((res: boolean) => {
			if (res) {
				this.getCustomers();
			}
		})
	}

	/** Get all customers */
	getCustomers(): void {
		var customerSub = this._customerService.getAllCustomers(this.customerListOptions).subscribe({
			next: (res: ApiResponse<ICustomer[]>) => {
				console.log(res);
				this.customers = res.data;
				this.totalRecords = res.total_records;
				this.activeCustomerId = res.data[0]['customerId'];
				this._customerService.selectCustomerToView.next(res.data[0]);
			},
			error: (err: any) => {
				this._toastrService.error(err);
			},
			complete: () => {
				customerSub.unsubscribe();
			}
		})
	}

	/** Procced to profile step from login step */
	proceedFirstStep(): void {
		if (this.loginDetailsForm.valid) {
			if (this.loginDetailsForm.value.password == this.loginDetailsForm.value.confirmPassword) {
				this.firstState = false;
			} else {
				this._toastrService.error("Password & Confirm Password should be same.")
			}

		} else {
			this.getFormValidationErrors();
		}
	}

	/** Final form submit for add customer */
	async profileDetailsSubmit(): Promise<void> {
		let customerDetails = { ...this.loginDetailsForm.value, ...this.profileDetailsForm.value };
		customerDetails.files = this.fileData;
		console.log("customerDetails", customerDetails);
		var customerSubmit: any = await lastValueFrom(this._customerService.addNewCustomers(customerDetails));
		if (!customerSubmit.has_error) {
			/** Upload customer image */
			if (this.fileData && this.fileData.name) {
				await this.uploadImage(customerSubmit.data.insertId);
			}

			this._toastrService.success(customerSubmit.message);
			this.loginDetailsForm.reset();
			this.profileDetailsForm.reset();
			this.closebutton.nativeElement.click();
			this.getCustomers();
		} else {
			this._toastrService.error(customerSubmit.message);
		}
	}

	/** Check form validation error */
	getFormValidationErrors() {
		Object.keys(this.loginDetailsForm.controls).forEach(key => {
			const controlErrors: ValidationErrors = this.loginDetailsForm.get(key).errors;
			if (controlErrors != null) {
				Object.keys(controlErrors).forEach(keyError => {
					this._toastrService.error(`${key}: ${keyError}`);
					//console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
				});
			}
		});
	}

	/** Cloas first step */
	closeFirstStep() {
		this.firstState = true;
		this.loginDetailsForm.reset();
	}

	/** Select a customer to view details */
	selectCustomer(customer: ICustomer) {
		this.activeCustomerId = customer.customerId;
		this._customerService.selectCustomerToView.next(customer);
	}

	/** On pagination page changes */
	onPageChange(value) {
		this.customerListOptions.startIndex = value;
		this.getCustomers();
	}

	/** On file input change */
	fileChange(event) {
		let fileList: FileList = event.target.files;
		if (fileList.length > 0) {
			let file: File = fileList[0];
			this.fileData = file;
			//this.uploadImage();
		}
	}

	/** Upload image of customer */
	async uploadImage(customerId: string): Promise<void> {
		const form = new FormData();
		form.append('customerId', customerId);
		form.append('file', this.fileData);
		var res = await lastValueFrom(this._customerService.imageUploadCustomers(form));
		console.log(res);
	}

	/** Get image of a customer */
	getImage(customerDetails: ICustomer): string {
		let imageUrl = '';
		if (customerDetails.image && customerDetails.image != '') {
			imageUrl = environment.API_BASE_URL + 'customerimage/' + customerDetails.image;
		} else {
			imageUrl = '/assets/no-image.webp';
		}
		return imageUrl;
	}

}
