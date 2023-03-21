import { IAddress } from "./address";

export interface ICustomer extends IAddress {
    customerId?: number | null,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    phone: string,
    dob: string,
    gender: string,
    password: string,
    confirmPassword?: string,
    image?: string
}