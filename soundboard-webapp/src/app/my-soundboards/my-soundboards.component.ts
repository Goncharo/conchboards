import { Component, OnInit } from '@angular/core';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ConfigurationService } from '../configuration/configuration.service';
import { AlertsService } from '../alerts/alerts.service';
import { SoundboardsService } from '../soundboards/soundboards.service';
import { Observable } from "rxjs";
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-my-soundboards',
    templateUrl: './my-soundboards.component.html',
    styleUrls: ['./my-soundboards.component.css']
})
export class MySoundboardsComponent implements OnInit {

    private _createdSoundboards = [];
    private _favouritedSoundboards = [];

    private _createdPage = 1;
    private _favouritedPage = 0;
    private _currentTab = "created";
    public fetching = false;

    constructor(private ngbConfig : NgbTabsetConfig,
                private route : ActivatedRoute,
                private config : ConfigurationService,
                private alerts : AlertsService,
                private sbService : SoundboardsService,
                private auth: AuthService,
                private router: Router) 
    { 
        this.ngbConfig.justify = 'center';
        this.ngbConfig.type = 'tabs';
    }

    ngOnInit() 
    {
        this.fetching = true;
        this.sbService.getMySoundboards("created", 1).subscribe(
            (data : Data) => {
                this.fetching = false;
                this._createdSoundboards = data["soundboards"];
            }
        );
    }

    private setCurrentTab(currentTab : string) : void
    {
        this._currentTab = currentTab;
    }

    private favouritedTabClicked(event) : void 
    {
        if(!this.auth.isAuthenticated())
        {
            event.preventDefault();
            event.stopPropagation();
            this.auth.handleAuthExpiry();
            return;
        }
        this._currentTab = "favourited";
        if(this._favouritedPage === 0)
        {
            this.onScroll();
        }
    }

    private createdTabClicked(event) : void
    {
        if(!this.auth.isAuthenticated())
        {
            event.preventDefault();
            event.stopPropagation();
            this.auth.handleAuthExpiry();
            return;
        }
        this._currentTab = "created";
    }

    public onScroll() : void
    {
        this.fetching = true;
        var page = (this._currentTab === "created") ? 
                    ++this._createdPage : ++this._favouritedPage;
        this.sbService.getMySoundboards(this._currentTab, page).subscribe(
            (response) => {
                this.fetching = false;
                
                if(response.success)
                {
                    if(this._currentTab === "created")
                    {
                        this._createdSoundboards = this._createdSoundboards.concat(response.soundboards);
                    }
                    else
                    {
                        this._favouritedSoundboards = this._favouritedSoundboards.concat(response.soundboards);
                    }
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

}
