import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICustomer } from '../interfaces/customer';
import { CustomerService } from '../services/customer.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	customerDetails: ICustomer = {
		customerId: null,
		firstName: '',
		lastName: '',
		userName: '',
		email: '',
		dob: '',
		gender: '',
		password: '',
		phone: '',
		address: '',
		city: "",
		country: "",
		state: "",
		zipcode: null,
		landmark: ""
	};

	firstState: boolean = true;
	loginDetailsForm: any;
	profileDetailsForm: any;
	@ViewChild('closebutton') closebutton;
	fileData: File;

	constructor(
		private toastrService: ToastrService,
		private _customerService: CustomerService
	) { }

	ngOnInit(): void {
		/** Form group for user login details */
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
		/** Form group for user profile details */
		this.profileDetailsForm = new FormGroup({
			address: new FormControl('', [Validators.required]),
			landmark: new FormControl('', [Validators.required]),
			city: new FormControl('', [Validators.required]),
			state: new FormControl('', [Validators.required]),
			country: new FormControl('', [Validators.required]),
			zipcode: new FormControl('', [Validators.required]),
			gender: new FormControl('', [Validators.required])
		})
		/** Subscribe the subject for customer to view */
		this._customerService.selectCustomerToView.subscribe({
			next: (res: any) => {
				if (res && res != '') {
					this.customerDetails = res;
				}
			}
		})
	}

	/** Delete Customer */
	async deleteCustomer(): Promise<void> {
		if (confirm("Are you sure to delete this customer ?")) {
			var res = await lastValueFrom(this._customerService.deleteCustomers(this.customerDetails.customerId));
			if (!res.has_error) {
				this.toastrService.success(res.message);
				this._customerService.customerIsDelete.next(true);
			} else {
				this.toastrService.error(res.message);
			}
		}
	}

	/** Procced to profile section from login section */
	proceedFirstStep(): void {
		if (this.loginDetailsForm.valid) {
			if (this.loginDetailsForm.value.password == this.loginDetailsForm.value.confirmPassword) {
				this.firstState = false;
			} else {
				this.toastrService.error("Password & Confirm Password should be same.")
			}

		} else {
			this.getFormValidationErrors();
		}
	}

	/**
	 * Add User form final submit
	 */
	async profileDetailsUpdateSubmit(): Promise<void> {
		let customerDetails = { ...this.loginDetailsForm.value, ...this.profileDetailsForm.value };
		customerDetails.customerId = this.customerDetails.customerId;
		var customerSubmit = await lastValueFrom(this._customerService.updateCustomers(customerDetails));
		if (!customerSubmit.has_error) {
			/** Upload Profile image */
			if (this.fileData && this.fileData.name) {
				await this.uploadImage(String(this.customerDetails.customerId));
			}

			this.toastrService.success(customerSubmit.message);
			this.firstState = true;
			this.loginDetailsForm.reset();
			this.profileDetailsForm.reset();
			this.closebutton.nativeElement.click();
			this._customerService.customerIsDelete.next(true);
		} else {
			this.toastrService.error(customerSubmit.message);
		}
	}

	/** CHeck form validation */
	getFormValidationErrors() {
		Object.keys(this.loginDetailsForm.controls).forEach(key => {
			const controlErrors: ValidationErrors = this.loginDetailsForm.get(key).errors;
			if (controlErrors != null) {
				Object.keys(controlErrors).forEach(keyError => {
					this.toastrService.error(`${key}: ${keyError}`);
					//console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
				});
			}
		});
	}

	/** Close form first step */
	closeFirstStep() {
		this.firstState = true;
		this.loginDetailsForm.reset();
	}

	/** Edit customer data */
	editCustomer(): void {
		let editCustomerLoginDetails = {
			userName: this.customerDetails.userName,
			firstName: this.customerDetails.firstName,
			lastName: this.customerDetails.lastName,
			email: this.customerDetails.email,
			phone: this.customerDetails.phone,
			dob: this.customerDetails.dob,
			password: '',
			confirmPassword: ''
		}
		let editCustomerProfileDetails = {
			address: this.customerDetails.address,
			landmark: this.customerDetails.landmark,
			city: this.customerDetails.city,
			state: this.customerDetails.state,
			country: this.customerDetails.country,
			zipcode: this.customerDetails.zipcode,
			gender: this.customerDetails.gender
		}
		this.loginDetailsForm.setValue(editCustomerLoginDetails);
		this.profileDetailsForm.setValue(editCustomerProfileDetails);
	}

	/** On file input changes */
	fileChange(event) {
		let fileList: FileList = event.target.files;
		if (fileList.length > 0) {
			let file: File = fileList[0];
			this.fileData = file;
			//this.uploadImage();
		}
	}
	/** Upload image */
	async uploadImage(customerId: string): Promise<void> {
		const form = new FormData();
		form.append('customerId', customerId);
		form.append('file', this.fileData);
		var res = await lastValueFrom(this._customerService.imageUploadCustomers(form));
		console.log(res);
	}
	/** Get customer image by Url */
	getImage(): string {
		let imageUrl = '';
		if (this.customerDetails.image && this.customerDetails.image != '') {
			imageUrl = environment.API_BASE_URL + 'customerimage/' + this.customerDetails.image;
		} else {
			imageUrl = '/assets/no-image.webp';
		}
		return imageUrl;
	}

}
