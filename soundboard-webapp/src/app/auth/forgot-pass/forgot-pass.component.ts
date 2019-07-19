import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AlertsService } from '../../alerts/alerts.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

@Component({
    selector: 'app-forgot-pass',
    templateUrl: './forgot-pass.component.html',
    styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

    public forgotPassForm : FormGroup;
    public loading = false;
    
    constructor(private fb: FormBuilder,
                private auth: AuthService,
                private alerts: AlertsService,
                public  config: ConfigurationService) { }

    ngOnInit() 
    {
        this.forgotPassForm = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            captcha: [null, Validators.required]
        })
    }

    public onForgotPass() : void 
    {
        this.loading = true;
        this.auth.forgotPass(this.forgotPassForm.controls.email.value,
            this.forgotPassForm.controls.captcha.value).subscribe(
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

    public onCaptcha(response)
    {
        this.forgotPassForm.patchValue({captcha: response});
    }

}
