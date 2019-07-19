import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { AlertsService } from "../alerts/alerts.service";
import { ConfigurationService } from "../configuration/configuration.service";

@Injectable()
export class AuthGuard implements CanActivate
{
    constructor(private auth : AuthService,
                private router: Router,
                private alerts: AlertsService,
                private config: ConfigurationService){}

    canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot)
    {
        if(!this.auth.isAuthenticated())
        {
            this.auth.handleAuthExpiry();
            return false;
        }
        
        return true;
    }
}