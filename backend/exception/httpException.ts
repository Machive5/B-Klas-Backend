export class HttpException extends Error {
    message: string;
    status: number;
    errorCode: ErrorCodes;
    error: any;

    constructor(status: number, message: string, errorCode: ErrorCodes, error: any) {
        super(message);
        this.message = message;
        this.status = status;
        this.errorCode = errorCode;
        this.error = error;
    }
}

export enum ErrorCodes{
    USER_ALREADY_EXISTS = 1001,
    USER_NOT_FOUND = 1002,
    INVALID_PASSWORD = 1003,
    INTERNAL_SERVER_ERROR = 1004,
    INVALID_DATA = 1005,
    UNAUTHORIZED = 1006,
}