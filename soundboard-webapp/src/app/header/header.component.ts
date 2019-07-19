import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AlertsService } from '../alerts/alerts.service';
import { ConfigurationService } from '../configuration/configuration.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit 
{
    public isCollapsed: boolean = true;

    constructor(public  auth : AuthService,
                private router: Router,
                private alerts: AlertsService,
                private config: ConfigurationService) { }

    ngOnInit() 
    {
    }

    public onSignout() : void
    {
        this.auth.signout();
        this.alerts.showAlert("success", "Signed out, see you soon!", this.config.alertTimeoutInMs, true);  
        this.router.navigate(['/soundboards']);
    }
}
