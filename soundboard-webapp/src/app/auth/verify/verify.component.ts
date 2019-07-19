import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from '../../alerts/alerts.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

    constructor(private auth : AuthService,
                private route : ActivatedRoute,
                private alerts : AlertsService,
                private router : Router,
                private config : ConfigurationService,
                @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() 
    {
        if (isPlatformBrowser(this.platformId)) 
        {
            this.route.queryParams.subscribe(params => {
                this.auth.verify(params['token']).subscribe(
                    (response) => {
                        if(response.success)
                        {
                            this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);                       
                            this.router.navigate(['/signin']);
                        }
                        else
                        {
                            this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                            this.router.navigate(['/']);
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            });
        }
    }

}
