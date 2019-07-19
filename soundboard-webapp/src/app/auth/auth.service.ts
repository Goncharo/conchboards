import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigurationService } from "../configuration/configuration.service";
import { Observable } from "rxjs";
import { AlertsService } from "../alerts/alerts.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthService
{
    private _jwt : String = "";
    private _id : String = "";
    private _isAdmin : Boolean = false;
    private _tokenExpiry : Date;

    constructor(private http: HttpClient,
                private config: ConfigurationService,
                private alerts: AlertsService,
                private router: Router)
    {

    }

    public isAuthenticated() : boolean
    {
        return (this.jwt != "" && this.id != "" && this.tokenExpiry > new Date());
    }

    public handleAuthExpiry() : void
    {
        this.alerts.showAlert("warning", "Please signin to continue.", this.config.alertTimeoutInMs, true);    
        this.router.navigate(['/signin']);
    }

    public getAuthHeaders () : HttpHeaders
    {
        var headers = new HttpHeaders();
        headers = headers.append("Authorization" , this.jwt.toString());
        return headers;
    }

    public signup (email : String, password : String, username: String, captchaResponse: String) : Observable<any>
    {
        return this.http.post(this.config.apiUrl + "/signup",
            { email : email, password : password, username : username, captchaResponse: captchaResponse});
    }

    public usernameExists (username: String) : Observable<any>
    {
        return this.http.get(this.config.apiUrl + `/usernameExists/${username}`);
    }

    public signin (email : String, password : String) : Observable<any>
    {
        return this.http.post(this.config.apiUrl + "/signin",
            { email : email, password : password});
    }

    public verify (token : String) : Observable<any>
    {
        return this.http.get(`${this.config.apiUrl}/verify/${token}`);
    } 

    public forgotPass (email : String, captchaResponse: String) : Observable<any>
    {
        return this.http.post(this.config.apiUrl + "/forgotpass", 
        { email : email, captchaResponse: captchaResponse});
    }

    public resetPass (password : String, token : String) : Observable<any>
    {
        return this.http.post(`${this.config.apiUrl}/resetpass/${token}`,
            { password : password });
    }

    public changePass (password : String, currentPassword : String) : Observable<any>
    {
        return this.http.post(`${this.config.apiUrl}/changepass`,
            { password : password, currentPassword : currentPassword }, {headers: this.getAuthHeaders()});
    }

    public signout () : void
    {
        localStorage.setItem('user', "");
        this.jwt = "";
        this.id = "";
        this.tokenExpiry = null;
        this.isAdmin = false;
    }

    public updateLocal () : void 
    {
        localStorage.setItem('user', JSON.stringify({
            jwt : this.jwt,
            id : this.id,
            tokenExpiry : this.tokenExpiry,
            isAdmin : this.isAdmin
        }));
    }

    // getters and setters
    get jwt() : String{ return this._jwt; }
    set jwt(jwt : String){ this._jwt = jwt; }
    get id() : String { return this._id; }
    set id(id : String){ this._id = id; }
    get tokenExpiry() : Date { return this._tokenExpiry; }
    set tokenExpiry(tokenExpiry : Date){ this._tokenExpiry = tokenExpiry; }
    get isAdmin() : Boolean { return this._isAdmin; }
    set isAdmin(isAdmin : Boolean){ this._isAdmin = isAdmin; }
}