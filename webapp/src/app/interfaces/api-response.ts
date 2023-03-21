export interface ApiResponse<T> {
    data: T,
    has_error: boolean,
    message: string,
    total_records?: number
}