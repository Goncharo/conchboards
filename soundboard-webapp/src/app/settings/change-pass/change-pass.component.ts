import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { AlertsService } from '../../alerts/alerts.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-change-pass',
    templateUrl: './change-pass.component.html',
    styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {

    public changePassForm : FormGroup;
    public token : String;
    public loading = false;

    constructor(private fb: FormBuilder,
                private auth: AuthService,
                private alerts: AlertsService,
                private config: ConfigurationService,
                private route: ActivatedRoute,
                private router: Router) { }

    ngOnInit() 
    {
        this.changePassForm = this.fb.group({
            currentPassword : [null, Validators.required],
            password : [null, [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,40}$/)]],
            passwordConf : [null, [Validators.required, this.passwordsMatch.bind(this)]]
        });   
    }

    public passwordsMatch(control: FormControl): {[s: string]: boolean}
    {
        if(this.changePassForm && control.value === this.changePassForm.controls.password.value)
        {
            return null;
        }
        else
        {
            return { 'notMatch': true };
        }
    }

    public onChangePassword() : void 
    {
        this.loading = true;
        this.auth.changePass(this.changePassForm.controls.password.value, 
            this.changePassForm.controls.currentPassword.value).subscribe(
                (response) => {
                    if(response.success)
                    {
                        this.loading = false;
                        this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);                       
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
