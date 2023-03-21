export interface IAddress {
    addressId?: number | null,
    customerId?: number | null,
    address: string,
    landmark: string,
    city: string,
    state: string,
    country: string,
    zipcode: number | null
}