import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AlertsService } from '../../alerts/alerts.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../configuration/configuration.service';
import { Location } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { map, subscribeOn, catchError} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


    public signupForm : FormGroup;
    public loading = false;
    public usernameExists = false;
    public checkedUsername = false;
    public checking = false;

    constructor(private fb : FormBuilder,
                private auth : AuthService,
                private alerts : AlertsService,
                private router : Router,
                public  config : ConfigurationService,
                private location : Location) { }

    ngOnInit() 
    {
        this.signupForm = this.fb.group({
            email : [null, [Validators.required, Validators.email]],
            username : [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9_]{1,15}$/)], this.userExists.bind(this)],
            password : [null, [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,40}$/)]],
            passwordConf : [null, [Validators.required, this.passwordsMatch.bind(this)]],
            terms: [null, Validators.requiredTrue],
            captcha: [null, Validators.required]
        });   
    }

    public onSignup() : void 
    {
        this.loading = true;
        this.auth.signup(this.signupForm.controls.email.value, 
            this.signupForm.controls.password.value,
            this.signupForm.controls.username.value,
            this.signupForm.controls.captcha.value).subscribe(
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

    public passwordsMatch(control: FormControl): {[s: string]: boolean}
    {
        if(this.signupForm && control.value === this.signupForm.controls.password.value)
        {
            return null;
        }
        else
        {
            return { 'notMatch': true };
        }
    }

    public userExists(control: FormControl): Observable<any | null>
    {
        if(this.signupForm && control.value)
        {
            var username = this.signupForm.controls.username.value;
            username = username.replace(/\s/g, '');
            if(!username) return null;
            return this.auth.usernameExists(this.signupForm.controls.username.value).pipe(map
            (
                (response) => ((response.userExists) ? {'userExists' : true} : null)
            ), catchError(() => null));
        }
        else
        {
            return null;
        }
    }

    public onCaptcha(response)
    {
        this.signupForm.patchValue({captcha: response});
    }

    public checkIfUsernameExists(username, callback)
    {
        username = username.replace(/\s/g, '');
        if(!username) return;
        this.checking = true;
        this.auth.usernameExists(this.signupForm.controls.username.value).subscribe(
            (response) => {
                this.checking = false;
                if(response.success)
                {
                    callback(response.userExists);
                }
                else
                {
                    callback(null);
                    this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                }
            },
            (error) => {
                callback(null);
                this.checking = false;
                this.alerts.showAlert("danger", "Something went wrong when checking if username exsits! Please try again.", this.config.alertTimeoutInMs, true);
                console.log(error);
            }
        );
    }

}
