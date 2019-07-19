import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AlertsService } from '../../alerts/alerts.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-reset-pass',
    templateUrl: './reset-pass.component.html',
    styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

    public resetForm : FormGroup;
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
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
        })

        this.resetForm = this.fb.group({
            password : [null, [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,40}$/)]],
            passwordConf : [null, [Validators.required, this.passwordsMatch.bind(this)]]
        });   
    }

    public passwordsMatch(control: FormControl): {[s: string]: boolean}
    {
        if(this.resetForm && control.value === this.resetForm.controls.password.value)
        {
            return null;
        }
        else
        {
            return { 'notMatch': true };
        }
    }

    public onResetPassword() : void 
    {
        this.loading = true;
        this.auth.resetPass(this.resetForm.controls.password.value, this.token).subscribe(
                (response) => {
                    if(response.success)
                    {
                        this.loading = false;
                        this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);                       
                        this.router.navigate(['/signin']);
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
