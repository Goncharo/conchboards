import { Component, OnInit, Input, Optional, OnDestroy, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Soundboard } from '../models/soundboard.model';
import { Data, Router, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../configuration/configuration.service';
import { SoundboardsService } from '../soundboards/soundboards.service';
import { AuthService } from '../auth/auth.service';
import { AlertsService } from '../alerts/alerts.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from '../../../node_modules/rxjs';
import { fromEvent } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
    selector: 'app-soundboard',
    templateUrl: './soundboard.component.html',
    styleUrls: ['./soundboard.component.css']
})
export class SoundboardComponent implements OnInit, OnDestroy {

    @Input() soundboard : Soundboard;
    public favourited : boolean;
    @Input() preview : boolean = false;
    public imageURL;
    public soundURLs = [];
    public audio;
    public fetching = false;
    public favouriting = false;
    public deleting = false;
    public reporting = false;
    public lastPlayedIndex = null;
    public buttonIsLoading = [];

    constructor(private route : ActivatedRoute,
                public  config : ConfigurationService,
                private sbService : SoundboardsService,
                public  auth : AuthService,
                private router : Router,
                private alerts : AlertsService,
                private modal : NgbModal,
                private location : Location,
                private meta : Meta,
                @Optional() public activeModal: NgbActiveModal,
                @Inject(PLATFORM_ID) private platformId: Object) 
    { 
        if (isPlatformBrowser(this.platformId)) {
            this.audio = new Audio();
         }
    }

    ngOnInit() 
    {
        if(!this.preview)
        {
            this.fetching = true;
            this.sbService.getSoundboard(this.route.snapshot.params['id']).subscribe(
                (data : Data) => {
                    if(data["success"])
                    {
                        this.fetching = false;
                        this.soundboard = data["soundboard"];
                        this.favourited = data["favourited"];
    
                        // add tags for sharing on twitter
                        this.meta.updateTag({ name: 'twitter:title', content: this.soundboard.name.toString() });
                        this.meta.updateTag({ name: 'twitter:description', content: 'View this soundboard and discover, create, and share others on the Conchboards platform!' });
                        this.meta.updateTag({ name: 'twitter:image', content: this.getImageURL() });
        
    
                        // add tags for sharing on facebook
                        this.meta.updateTag({ name: 'og:title', content: this.soundboard.name.toString() });
                        this.meta.updateTag({ name: 'og:description', content: 'View this soundboard and discover, create, and share others on the Conchboards platform!' });
                        this.meta.updateTag({ name: 'og:image', content: this.getImageURL() });
    
                        if (isPlatformBrowser(this.platformId)) 
                        {
                            fromEvent(this.audio, 'ended').subscribe(() => {
                                this.buttonIsLoading[this.lastPlayedIndex] = false;
                            }) ;
                            this.soundboard.soundFiles.forEach((file) => {
                                this.buttonIsLoading.push(false);
                            });
                        }
                    }
                    else
                    {
                        this.fetching = false;
                    }
                }
            );
        }
        else
        {
            // setup local URLs for preview
            this.imageURL = URL.createObjectURL(this.soundboard.image);
            this.soundboard.soundFiles.forEach((file) => {
                this.soundURLs.push(URL.createObjectURL(file.soundFile));
            });

        }
        
    }

    ngOnDestroy()
    {
        if (isPlatformBrowser(this.platformId)) 
        {
            // clean up allocated URLs
            URL.revokeObjectURL(this.imageURL);
            this.soundURLs.forEach((url) => {
                URL.revokeObjectURL(url);
            });
            this.audio.pause();
        }
    }

    public playSound(event : any) : void
    {
        var index = event.target.id;
        if (!index) index = event.target.parentNode.id;

        if (this.lastPlayedIndex && index == this.lastPlayedIndex && this.buttonIsLoading[index])
        {
            this.buttonIsLoading[index] = false;
            this.audio.pause();
            return;
        }
        else if (this.lastPlayedIndex)
        {
            this.buttonIsLoading[this.lastPlayedIndex] = false;
        }

        this.buttonIsLoading[index] = true;
        this.lastPlayedIndex = index;
        this.audio.setAttribute('src', this.getSoundURL(index));
        this.audio.play();
    }

    public getImageURL() : string
    {
        return (this.preview) ? this.imageURL : 
            this.config.apiUrl + '/static/' + this.soundboard.image;
    }

    public getSoundURL(index : number) : string
    {
        return (this.preview) ? this.soundURLs[index] : 
            this.config.apiUrl + "/static/" + this.soundboard.soundFiles[index].soundFile;
    }
    

    public favourite() : void
    {
        if(!this.auth.isAuthenticated())
        {
            this.auth.handleAuthExpiry();
            return;
        }
        this.favouriting = true;
        this.favourited = !this.favourited;
        this.sbService.favourite(this.soundboard.id).subscribe(
            (response) => 
            {
                if(response.success)
                {
                    this.favouriting = false;
                    this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);
                }
                else
                {
                    this.favouriting = false;
                    this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                }
            },
            (error) => 
            {
                this.favouriting = false;
                this.alerts.showAlert("danger", "Something went wrong! Please try again later.", this.config.alertTimeoutInMs, true);
                console.log(error);
            }
        );
    }

    public reactToCopy() : void
    {
        this.alerts.showAlert("success", "Link copied to clipboard.", this.config.alertTimeoutInMs, true);
    }

    private confirmDeleteSoundboard(modal) : void
    {
        this.modal.open(modal).result.then(
            (result) => {
                if(result === "Delete")
                {
                    this.deleteSoundboard();
                }
            },
            (reason) => {
                // do nothing
            }
        );
    }

    private confirmReportSoundboard(modal) : void
    {
        this.modal.open(modal).result.then(
            (result) => {
                if(result === "Report")
                {
                    this.reportSoundboard("false");
                }
                else if(result === "Block")
                {
                    this.reportSoundboard("true");
                }
            },
            (reason) => {
                // do nothing
            }
        );
    }

    private deleteSoundboard() : void
    {
        if(!this.auth.isAuthenticated())
        {
            this.auth.handleAuthExpiry();
            return;
        }
        this.deleting = true;
        this.sbService.deleteSoundboard(this.soundboard.id).subscribe(
            (response) => {
                if(response.success)
                {
                    this.deleting = false;
                    this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);    
                    this.router.navigate(['/mysoundboards']);
                }
                else
                {
                    this.deleting = false;
                    this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                }
            },
            (error) => {
                this.deleting = false;
                this.alerts.showAlert("danger", "Something went wrong! Please try again later.", this.config.alertTimeoutInMs, true);
                console.log(error);
            }
        );
    }

    private reportSoundboard(blockUser : string) : void 
    {
        if(!this.auth.isAuthenticated())
        {
            this.auth.handleAuthExpiry();
            return;
        }
        this.reporting = true;
        this.sbService.report(this.soundboard.id, blockUser).subscribe(
            (response) => {
                if(response.success)
                    {
                        this.reporting = false;
                        this.alerts.showAlert("success", response.message, this.config.alertTimeoutInMs, true);    
                    }
                    else
                    {
                        this.reporting = false;
                        this.alerts.showAlert("danger", response.message, this.config.alertTimeoutInMs, true);
                    }
            },
            (error) => {
                this.reporting = false;
                this.alerts.showAlert("danger", "Something went wrong! Please try again later.", this.config.alertTimeoutInMs, true);
                console.log(error);
            }
        );
    }

    public onBackClicked() : void
    {
        this.location.back();
    }

}
