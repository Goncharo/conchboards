import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router, Data } from '@angular/router';
import { AlertsService } from '../alerts/alerts.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { AdminService } from './admin.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    public sending = false;
    public sendMailForm : FormGroup;
    public page = 0;
    public fetching = false;
    public maliciousUsers = [];
    public isCollapsedToggles = [];
    public loadingStates = [];

    constructor(private fb : FormBuilder,
                private admin : AdminService,
                private router : Router,
                private alerts : AlertsService,
                private config : ConfigurationService) {}

    ngOnInit() 
    {
        this.sendMailForm = this.fb.group({
            subject : [null, Validators.required],
            body : [null, Validators.required]
        });
        this.fetching = true;
        this.admin.getMaliciousUsers(++this.page).subscribe(
            (data : Data) => {
                this.fetching = false;
                this.maliciousUsers = data["users"];
                this.maliciousUsers.forEach(user => {
                    this.isCollapsedToggles.push(1);
                    this.loadingStates.push(0);
                });
            }
        );
    }

    public onSendMail() : void
    {
        this.sending = true;
        this.admin.sendMail(this.sendMailForm.controls.subject.value, 
            this.sendMailForm.controls.body.value).subscribe(
                (response) => {
                    if(response.success)
                    {
                        this.sending = false;
                        this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);    
                    }
                    else
                    {
                        this.sending = false;
                        this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                    }
                },
                (error) => {
                    this.sending = false;
                    this.alerts.showAlert("danger", "Something went wrong! Please try again later.", this.config.alertTimeoutInMs, true);
                    console.log(error);
                }
            );
    }

    public fetchUsers() : void 
    {
        this.fetching = true;
        this.admin.getMaliciousUsers(++this.page).subscribe(
            (response) => {
                this.fetching = false;
                if(response.success)
                {
                    this.maliciousUsers = this.maliciousUsers.concat(response.users);
                }
                else
                {
                    this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                }
            },
            (error) => {
                this.fetching = false;
                console.log(error);
            }
        );
    }

    public banUser(index : number)
    {
        this.loadingStates[index] = 1;
        this.admin.banUser(this.maliciousUsers[index].userID).subscribe(
            (response) => {
                this.loadingStates[index] = 0;
                if(response.success)
                {
                    this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);
                }
                else
                {
                    this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                }
            },
            (error) => {
                this.loadingStates[index] = 0;
                console.log(error);
            }
        );
    }

    public banhammerUser(index : number)
    {
        this.loadingStates[index] = 1;
        this.admin.banHammerUser(this.maliciousUsers[index].userID).subscribe(
            (response) => {
                this.loadingStates[index] = 0;
                if(response.success)
                {
                    this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);
                }
                else
                {
                    this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                }
            },
            (error) => {
                this.loadingStates[index] = 0;
                console.log(error);
            }
        );
    }

    public onScroll() : void 
    {
        this.fetchUsers();
    }

}
