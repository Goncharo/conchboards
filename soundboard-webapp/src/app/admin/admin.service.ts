import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigurationService } from "../configuration/configuration.service";
import { Observable } from "rxjs";
import { AlertsService } from "../alerts/alerts.service";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AdminService
{

    constructor(private http: HttpClient,
                private config: ConfigurationService,
                private alerts: AlertsService,
                private auth: AuthService,
                private router: Router)
    {

    }

    public sendMail (subject : String, body : String) : Observable<any>
    {
        return this.http.post(this.config.apiUrl + "/admin/email",
            { subject : subject, body : body}, {headers: this.auth.getAuthHeaders()});
    }

    public getMaliciousUsers(page : Number) : Observable<any>
    {
        return this.http.get(this.config.apiUrl + "/admin/malicious"
            + "?page="  + page + "&limit=" + this.config.paginationLimit,
             { headers : this.auth.getAuthHeaders() });
    }

    public banUser (id : String) : Observable<any>
    {
        return this.http.post(this.config.apiUrl + `/admin/ban/${id}`,
            {}, {headers: this.auth.getAuthHeaders()});
    }

    public banHammerUser (id : String) : Observable<any>
    {
        return this.http.post(this.config.apiUrl + `/admin/banhammer/${id}`,
            {}, {headers: this.auth.getAuthHeaders()});
    }
}