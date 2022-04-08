import { CreateUserType } from './types/CreateUser';
import { LoginUserType } from './types/LoginUser';
import { VerifyAccountType } from './types/VerifyAccount';
import { AccountExistsType } from './types/AccountExists';
import { AccountPendingType } from './types/AccountPending';
import { AuthenticateAccount } from './types/AuthenticateAccount';
export declare class CharonAPIEndpoints {
    private apiToken;
    private server;
    constructor(apiToken: string);
    createUserEndpoint(req: any, res: any, next: any): Promise<void>;
    requestLoginEndpoint(req: any, res: any, next: any): Promise<void>;
    getPendingAuthDevicesEndpoint(req: any, res: any, next: any): Promise<true | undefined>;
    authenticatePendingEndpoint(req: any, res: any, next: any): Promise<void>;
}
export declare class CharonServer {
    private apiToken;
    constructor(apiToken: string);
    createUser(username: string, userMacAddress: string): Promise<CreateUserType | false>;
    getPendingAuthDevices(username: string, key: string): Promise<AccountPendingType | false>;
    authenticatePendingRequest(username: string, authkey: string, pendingkey: string, authorized: boolean): Promise<AuthenticateAccount | false>;
    checkIfAccountExists(username: string): Promise<AccountExistsType | false>;
    loginUser(username: string, userMacAddress: string): Promise<LoginUserType | false>;
    verifyAccount(username: string, key: string): Promise<VerifyAccountType | false>;
    verifyAccountMiddleware(req: any, res: any, next: any): Promise<void>;
}
