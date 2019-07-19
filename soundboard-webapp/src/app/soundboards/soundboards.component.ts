import { Component, OnInit } from '@angular/core';
import { Data, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../configuration/configuration.service';
import { SoundboardsService } from './soundboards.service';
import { AlertsService } from '../alerts/alerts.service';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-soundboards',
    templateUrl: './soundboards.component.html',
    styleUrls: ['./soundboards.component.css']
})
export class SoundboardsComponent implements OnInit {

    public fetching = false;
    public searching = false;
    public hottestSoundboards = [];
    public newestSoundboards = [];

    private _hottestPage = 1;
    private _newestPage = 0;
    private _currentTab = "hottest";

    constructor(private route : ActivatedRoute,
                private config : ConfigurationService,
                private sbService : SoundboardsService,
                private alerts : AlertsService,
                private ngbConfig : NgbTabsetConfig) 
    { 
        this.ngbConfig.justify = 'center';
        this.ngbConfig.type = 'tabs';
    }

    ngOnInit() 
    {
        this.fetching = true;
        this.sbService.getSoundboards(1, "", "hottest").subscribe(
            (data : Data) => {
                this.fetching = false;
                this.hottestSoundboards = data["soundboards"];
            }
        );
    }

    private setCurrentTab(currentTab : string) : void
    {
        this._currentTab = currentTab;
    }

    private newestTabClicked() : void 
    {
        this._currentTab = "newest";
        if(this._newestPage === 0)
        {
            this.onScroll();
        }
    }

    private hottestTabClicked() : void
    {
        this._currentTab = "hottest";
    }

    public onScroll () : void
    {
        this.fetching = true;
        this.fetchBoards("");
    }

    public onSearch(query : String) : void
    {
        this.searching = true;
        if(this._currentTab === "hottest")
        {
            this._hottestPage = 0;
            this.hottestSoundboards = [];
        }
        else
        {
            this._newestPage = 0;
            this.newestSoundboards = [];
        }
        this.fetchBoards(query);
    }

    private fetchBoards(query : String) : void
    {
        var page = (this._currentTab === "hottest") ? 
            ++this._hottestPage : ++this._newestPage;
        this.sbService.getSoundboards(page, query, this._currentTab).subscribe(
            (response) => {
                this.fetching = false;
                this.searching = false;
                if(response.success)
                {
                    if(this._currentTab === "hottest")
                    {
                        this.hottestSoundboards = this.hottestSoundboards.concat(response.soundboards);
                    }
                    else
                    {
                        this.newestSoundboards = this.newestSoundboards.concat(response.soundboards);
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
