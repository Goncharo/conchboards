import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { Sound } from '../models/sound.model';
import { SoundboardsService } from '../soundboards/soundboards.service';
import { Soundboard } from '../models/soundboard.model';
import { AlertsService } from '../alerts/alerts.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { Router } from '@angular/router';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { SoundboardComponent } from '../soundboard/soundboard.component';
import { AuthService } from '../auth/auth.service';
import fileType from 'file-type';

@Component({
    selector: 'ngbd-modal-content',
    template: `
      <div class="modal-header">
        <h4 class="modal-title">Are you sure you want to leave? All changes will be discarded.</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" (click)="activeModal.close('Leave')">Leave Page</button>
        <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Cancel')">Cancel</button>
      </div>
   `
})
export class DeactivateModal 
{
    constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit 
{
    public  createForm : FormGroup;
    private _formSoundFiles : File[] = [];
    private _image : File;
    public  uploading : Boolean = false;
    public percentDone : number = 0;
    private _soundsLimit : number = 12;
    private _uploaded : Boolean = false;
    public loading = false;
    public fileReader : FileReader;

    constructor(private fb : FormBuilder,
                private sbService : SoundboardsService,
                private alerts : AlertsService,
                private config : ConfigurationService,
                private router : Router,
                private modal : NgbModal,
                private auth: AuthService)
    {

    }

    public ngOnInit() : void
    {
        this.createForm = this.fb.group({
            name : [null, Validators.required],
            sounds : this.fb.array([])
        });

        this.addSound();
    }

    public addSound() : void
    {
        (this.createForm.get("sounds") as FormArray).push(
            this.fb.group({
                soundName : [null, Validators.required],
                soundFile : [null]
            }));
    }

    public handleSoundFile(fileInput : any) : void
    {
        if(fileInput.files.item(0).size > this.config.maxFileSize)
        {
            fileInput.value = '';
            this.alerts.showAlert("warning", "File size cannot exceed 2.5MB", this.config.alertTimeoutInMs, true);
            window.scrollTo(0, 0);
            return;
        }

        this.fileReader = new FileReader();

        this.fileReader.onloadend = function(evt) {
            if (this.fileReader.readyState === FileReader.DONE) {
                var arrBuf = this.fileReader.result as ArrayBuffer;
                const uint = new Uint8Array(arrBuf);
                var obj = fileType(uint);

                if(obj.ext != "wav" && obj.ext != "mp3" && obj.ext != "aiff" && obj.ext != "aif" && obj.ext != "mpga")
                {

                    fileInput.value = '';
                    this.alerts.showAlert("warning", "Audio file type unsupported", this.config.alertTimeoutInMs, true);
                    window.scrollTo(0, 0);
                    return;
                }
                else
                {
                    var sound : File = new File([arrBuf], `${fileInput.files.item(0).name}`, {type: obj.mime});
                    this._formSoundFiles[Number(fileInput.id)] = sound;
                }
            }
        }.bind(this);

        this.fileReader.readAsArrayBuffer(fileInput.files.item(0));

    }

    public handleImageFile(imageInput : any) : void 
    {
        if(imageInput.files.item(0).size > this.config.maxFileSize)
        {
            imageInput.value = '';
            this.alerts.showAlert("warning", "File size cannot exceed 2.5MB", this.config.alertTimeoutInMs, true);
            window.scrollTo(0, 0);
            return;
        }

        var nameArr = imageInput.files.item(0).name.split(".");
        var fileExtension = nameArr[nameArr.length-1];

        if(fileExtension != "jpg" && fileExtension != "jpeg" && fileExtension != "png")
        {
            imageInput.value = '';
            this.alerts.showAlert("warning", "Image files must be jpg, jpeg, or png format", this.config.alertTimeoutInMs, true);
            return;
        }

        this._image = imageInput.files.item(0);
    }

    public create() : void
    {   
        if(!this.auth.isAuthenticated())
        {
            this.auth.handleAuthExpiry();
            return;
        }

        this.loading = true;
        this.sbService.createSoundboard(this.constructSoundboard()).subscribe(
            (event) => 
            {
                if(event.type === HttpEventType.Sent)
                {
                    this.uploading = true;
                }
                else if (event.type === HttpEventType.UploadProgress)
                {
                    this.percentDone = Math.round(100 * event.loaded / event.total);    
                }
                else if (event.type === HttpEventType.Response)
                {
                    this.loading = false;
                    this.uploading = false;
                    if(event.body.success)
                    {
                        this.alerts.showAlert("success", event.body.message, this.config.alertTimeoutInMs, true); 
                        this._uploaded = true;
                        this.router.navigate(['/mysoundboards']);
                    }
                    else
                    {
                        this.alerts.showAlert("danger", event.body.message, this.config.alertTimeoutInMs, true);
                    }
                }
            },
            (error) => 
            {
                this.alerts.showAlert("danger", "Something went wrong! Please try again later.", this.config.alertTimeoutInMs, true);
                this.uploading = false;
                this.loading = false;
                console.log(error);
            }
        );
    }

    private handleProgress(event : HttpEvent<any>)
    {
        if(event.type === HttpEventType.Sent)
        {
            this.uploading = true;
        }
        else if (event.type === HttpEventType.UploadProgress)
        {
            this.percentDone = Math.round(100 * event.loaded / event.total);                    
        }
        else if (event.type === HttpEventType.Response)
        {
            if(event.body.success)
            {
                this.alerts.showAlert("success", event.body.message, this.config.alertTimeoutInMs, true); 
                this.router.navigate(['/mysoundboards']);
            }
            else
            {
                this.alerts.showAlert("danger", event.body.message, this.config.alertTimeoutInMs, true);
                this.uploading = false;
                this.loading = false;
            }
        }
    }

    public allSoundsAssigned()
    {
        return (this._formSoundFiles.length === this.sounds.length) 
                && this.sounds.length >= 1;
    }

    public constructSoundboard() : Soundboard
    {
        var sounds : Sound[] = [];
        var soundsForm = this.createForm.controls.sounds.value;
        for(var i = 0; i < soundsForm.length ; i ++)
        {
            sounds.push(new Sound(soundsForm[i].soundName, this._formSoundFiles[i]));
        }
        return new Soundboard(this.createForm.controls.name.value, 
            this._image, sounds, "", "", "", "");
    }

    public onPreviewSoundboard() : void
    {
        const modalRef = this.modal.open(SoundboardComponent);
        modalRef.componentInstance.preview = true;
        modalRef.componentInstance.soundboard = this.constructSoundboard();
    }

    public deleteSound(index : number) : void
    {
        this.sounds.removeAt(index);
        this._formSoundFiles.splice(index, 1);
    }

    public canAdd() : boolean
    {
        return this.sounds.length < this._soundsLimit;
    }

    public modified() : boolean
    {
        return (this.createForm.dirty && !this._uploaded);
    }

    public confirm() : Promise<any>
    {
        return this.modal.open(DeactivateModal).result;
    }

    get sounds () : FormArray
    {
        return (this.createForm.get("sounds") as FormArray);
    }

}
