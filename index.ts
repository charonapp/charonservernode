import * as axios from 'axios';
import { CreateUserType } from './types/CreateUser';
import { LoginUserType } from './types/LoginUser';
import { VerifyAccountType } from './types/VerifyAccount';
import { AccountExistsType } from './types/AccountExists';
import { AccountPendingType } from './types/AccountPending';
import { AuthenticateAccount } from './types/AuthenticateAccount';

export class CharonAPIEndpoints{
    private apiToken:string;
    private server:CharonServer;

    constructor(apiToken:string){
        this.apiToken = apiToken;
        this.server = new CharonServer(this.apiToken);
    }

    public async createUserEndpoint(req:any,res:any,next:any){
        var user = await this.server.createUser(req.body.username,req.body.address);

        if(user){
            if(user.status == "success"){
                res.json({'status':'success','key':user.accountKey,'username':req.body.username});
            }else{
                res.json({'status':user.status});
            }
        }else{
            throw new Error("Something went wrong with the Charon Authentication servers. Please try again.");
        }
    }

    public async requestLoginEndpoint(req:any,res:any,next:any){
        var user = await this.server.loginUser(req.body.username,req.body.address);

        if(user){
            if(user.status == 'success'){
                res.json({'status':'success',pending:true,key:user.key});
            }else{
                res.json({'status':user.status});
            }
        }else{
            throw new Error("Something went wrong with the Charon Authentication servers. Please try again.");
        }
    }

    public async getPendingAuthDevicesEndpoint(req:any,res:any,next:any){
        var pending = await this.server.getPendingAuthDevices(req.body.username,req.body.key);

        if(pending){
            if(pending.status == 'success'){
                res.json({'status':pending.status,'username':pending.username,'pending':pending.pending});

                return true;
            }else{
                res.json({'status':pending.status});
            }
        }else{
            throw new Error("Something went wrong with the Charon Authentication servers. Please try again.");
        }
    }

    public async authenticatePendingEndpoint(req:any,res:any,next:any){
        var user = await this.server.authenticatePendingRequest(req.body.username,req.body.authkey,req.body.pendingkey,req.body.authorized);

        if(user){
            if(user.status == 'success'){
                res.json({'status':user.status,"username":user.username,'authorized':user.authorized});
            }else{
                res.json({'status':user.status});
            }
        }else{
            throw new Error("Something went wrong with the Charon Authentication servers. Please try again.");
        }
    }
}

export class CharonServer{
    private apiToken:string;

    constructor(apiToken:string){
        this.apiToken = apiToken;
    }

    public async createUser(username:string,userMacAddress:string): Promise<CreateUserType | false>{
        var charonRes = await axios.default.post('https://charonapp.herokuapp.com/v1/account/create',{username:username,'address':userMacAddress,'notificationid':'empty'},{headers:{
            'Authorization':`Bearer ${this.apiToken}`
        }}).catch(e =>{
            throw new Error("Charon App API token is invalid.");
        });

        if(charonRes){
            return charonRes.data as CreateUserType;
        }else{
            return false;
        }
    }

    public async getPendingAuthDevices(username:string,key:string):Promise<AccountPendingType|false>{
        var charonRes = await axios.default.post('https://charonapp.herokuapp.com/v1/account/pending',{'username':username,key:key},{headers:{
            'Authorization':`Bearer ${this.apiToken}`
        }}).catch(e =>{
            throw new Error("Charon App API token is invalid.");
        });

        if(charonRes){
            return charonRes.data as AccountPendingType;
        }else{
            return false;
        }
    }

    public async authenticatePendingRequest(username:string,authkey:string,pendingkey:string,authorized:boolean):Promise<AuthenticateAccount | false>{
        var charonRes = await axios.default.post('https://charonapp.herokuapp.com/v1/account/authenticate',{'username':username,authkey,pendingkey,authorized:authorized},{headers:{
            'Authorization':`Bearer ${this.apiToken}`
        }}).catch(e =>{
            throw new Error("Charon App API token is invalid.");
        });

        if(charonRes){
            return charonRes.data as AuthenticateAccount;
        }else{
            return false;
        }
    }

    public async checkIfAccountExists(username:string):Promise<AccountExistsType | false>{
        var charonRes = await axios.default.get(`https://charonapp.herokuapp.com/v1/account/username/${username}`,{headers:{
            'Authorization':`Bearer ${this.apiToken}`
        }}).catch(e =>{
            throw new Error("Charon App API token is invalid.");
        });
        if(charonRes){
            return charonRes.data as AccountExistsType;
        }else{
            return false;
        }
    }

    public async loginUser(username:string,userMacAddress:string):Promise<LoginUserType | false>{
        var charonRes = await axios.default.post('https://charonapp.herokuapp.com/v1/account/login',{'username':username,'address':userMacAddress,'notificationid':'empty'},{headers:{
            'Authorization':`Bearer ${this.apiToken}`
        }}).catch(e =>{
            throw new Error("Charon App API token is invalid.");
        });

        if(charonRes){
            return charonRes.data as LoginUserType;
        }else{
            return false;
        }
    }

    public async verifyAccount(username:string,key:string):Promise<VerifyAccountType | false>{
        var charonRes = await axios.default.post('https://charonapp.herokuapp.com/v1/account/verify',{key:key,username:username},{headers:{
            'Authorization':`Bearer ${this.apiToken}`
        }}).catch(e =>{
            throw new Error("Charon App API token is invalid.");
        });

        if(charonRes){
            return charonRes.data as VerifyAccountType;
        }else{
            return false;
        }
    }

    public async verifyAccountMiddleware(req:any,res:any,next:any){
        var charonRes = await axios.default.post('https://charonapp.herokuapp.com/v1/account/verify',{key:req.body.key,username:req.body.username},{headers:{
            'Authorization':`Bearer ${this.apiToken}`
        }}).catch(e =>{
            if(e.response.status == 401){
                res.sendStatus(401);
            }else if(e.response.status == 403){
                res.sendStatus(403);
            }
        });

        if(charonRes){
            req.charon = {username:charonRes.data.username,auth:charonRes.data.auth};

            next();
        }else{
            throw new Error("Charon App API token is invalid.");
        }



        
    }
}