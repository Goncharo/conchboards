import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { error } from 'util';
import { Router } from '@angular/router';
import { AlertsService } from '../../alerts/alerts.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    public signinForm : FormGroup;
    public loading = false;

    constructor(private fb : FormBuilder,
                private auth : AuthService,
                private router : Router,
                private alerts : AlertsService,
                private config : ConfigurationService) { }

    ngOnInit() 
    {
        this.signinForm = this.fb.group({
            email : [null, [Validators.required, Validators.email]],
            password : [null, Validators.required]
        });
    }

    public onSignin() : void 
    {
        this.loading = true;
        this.auth.signin(this.signinForm.controls.email.value, 
            this.signinForm.controls.password.value).subscribe(
                (response) => {
                    if(response.success)
                    {
                        this.loading = false;
                        this.auth.jwt = response.jwt;
                        this.auth.id = response.id;
                        this.auth.tokenExpiry = new Date(Date.now() + response.tokenValidFor * 1000);
                        this.auth.isAdmin = response.isAdmin;
                        this.auth.updateLocal();
                        this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);    
                        this.router.navigate(['/soundboards']);
                    }
                    else
                    {
                        this.loading = false;
                        this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                    }
                },
                (error) => {
                    this.loading = false;
                    this.alerts.showAlert("danger", "Something went wrong! Please try again later.", this.config.alertTimeoutInMs, true);
                    console.log(error);
                }
            );
    }

}
