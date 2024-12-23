import { ErrorCodes, HttpException } from "./httpException";

export class AuthException extends HttpException {
    constructor(message: string, error: any) {
        super(401, message, ErrorCodes.UNAUTHORIZED, error);
    }
}