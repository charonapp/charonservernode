"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharonServer = exports.CharonAPIEndpoints = void 0;
const axios = __importStar(require("axios"));
class CharonAPIEndpoints {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.server = new CharonServer(this.apiToken);
    }
    createUserEndpoint(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield this.server.createUser(req.body.username, req.body.address);
            if (user) {
                if (user.status == "success") {
                    res.json({ 'status': 'success', 'key': user.accountKey, 'username': req.body.username });
                }
                else {
                    res.json({ 'status': user.status });
                }
            }
            else {
                throw new Error("Something went wrong with the Charon Authentication servers. Please try again.");
            }
        });
    }
    requestLoginEndpoint(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield this.server.loginUser(req.body.username, req.body.address);
            if (user) {
                if (user.status == 'success') {
                    res.json({ 'status': 'success', pending: true, key: user.key });
                }
                else {
                    res.json({ 'status': user.status });
                }
            }
            else {
                throw new Error("Something went wrong with the Charon Authentication servers. Please try again.");
            }
        });
    }
    getPendingAuthDevicesEndpoint(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var pending = yield this.server.getPendingAuthDevices(req.body.username, req.body.key);
            if (pending) {
                if (pending.status == 'success') {
                    res.json({ 'status': pending.status, 'username': pending.username, 'pending': pending.pending });
                    return true;
                }
                else {
                    res.json({ 'status': pending.status });
                }
            }
            else {
                throw new Error("Something went wrong with the Charon Authentication servers. Please try again.");
            }
        });
    }
    authenticatePendingEndpoint(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield this.server.authenticatePendingRequest(req.body.username, req.body.authkey, req.body.pendingkey, req.body.authorized);
            if (user) {
                if (user.status == 'success') {
                    res.json({ 'status': user.status, "username": user.username, 'authorized': user.authorized });
                }
                else {
                    res.json({ 'status': user.status });
                }
            }
            else {
                throw new Error("Something went wrong with the Charon Authentication servers. Please try again.");
            }
        });
    }
}
exports.CharonAPIEndpoints = CharonAPIEndpoints;
class CharonServer {
    constructor(apiToken) {
        this.apiToken = apiToken;
    }
    createUser(username, userMacAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            var charonRes = yield axios.default.post('https://charonapp.herokuapp.com/v1/account/create', { username: username, 'address': userMacAddress, 'notificationid': 'empty' }, { headers: {
                    'Authorization': `Bearer ${this.apiToken}`
                } }).catch(e => {
                throw new Error("Charon App API token is invalid.");
            });
            if (charonRes) {
                return charonRes.data;
            }
            else {
                return false;
            }
        });
    }
    getPendingAuthDevices(username, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var charonRes = yield axios.default.post('https://charonapp.herokuapp.com/v1/account/pending', { 'username': username, key: key }, { headers: {
                    'Authorization': `Bearer ${this.apiToken}`
                } }).catch(e => {
                throw new Error("Charon App API token is invalid.");
            });
            if (charonRes) {
                return charonRes.data;
            }
            else {
                return false;
            }
        });
    }
    authenticatePendingRequest(username, authkey, pendingkey, authorized) {
        return __awaiter(this, void 0, void 0, function* () {
            var charonRes = yield axios.default.post('https://charonapp.herokuapp.com/v1/account/authenticate', { 'username': username, authkey, pendingkey, authorized: authorized }, { headers: {
                    'Authorization': `Bearer ${this.apiToken}`
                } }).catch(e => {
                throw new Error("Charon App API token is invalid.");
            });
            if (charonRes) {
                return charonRes.data;
            }
            else {
                return false;
            }
        });
    }
    checkIfAccountExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var charonRes = yield axios.default.get(`https://charonapp.herokuapp.com/v1/account/username/${username}`, { headers: {
                    'Authorization': `Bearer ${this.apiToken}`
                } }).catch(e => {
                throw new Error("Charon App API token is invalid.");
            });
            if (charonRes) {
                return charonRes.data;
            }
            else {
                return false;
            }
        });
    }
    loginUser(username, userMacAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            var charonRes = yield axios.default.post('https://charonapp.herokuapp.com/v1/account/login', { 'username': username, 'address': userMacAddress, 'notificationid': 'empty' }, { headers: {
                    'Authorization': `Bearer ${this.apiToken}`
                } }).catch(e => {
                throw new Error("Charon App API token is invalid.");
            });
            if (charonRes) {
                return charonRes.data;
            }
            else {
                return false;
            }
        });
    }
    verifyAccount(username, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var charonRes = yield axios.default.post('https://charonapp.herokuapp.com/v1/account/verify', { key: key, username: username }, { headers: {
                    'Authorization': `Bearer ${this.apiToken}`
                } }).catch(e => {
                throw new Error("Charon App API token is invalid.");
            });
            if (charonRes) {
                return charonRes.data;
            }
            else {
                return false;
            }
        });
    }
    verifyAccountMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var charonRes = yield axios.default.post('https://charonapp.herokuapp.com/v1/account/verify', { key: req.body.key, username: req.body.username }, { headers: {
                    'Authorization': `Bearer ${this.apiToken}`
                } }).catch(e => {
                if (e.response.status == 401) {
                    res.sendStatus(401);
                }
                else if (e.response.status == 403) {
                    res.sendStatus(403);
                }
            });
            if (charonRes) {
                req.charon = { username: charonRes.data.username, auth: charonRes.data.auth };
                next();
            }
            else {
                throw new Error("Charon App API token is invalid.");
            }
        });
    }
}
exports.CharonServer = CharonServer;
