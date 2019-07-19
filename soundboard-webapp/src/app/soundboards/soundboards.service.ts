import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Soundboard } from "../models/soundboard.model";
import { Observable } from "rxjs";
import { ConfigurationService } from "../configuration/configuration.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class SoundboardsService
{
    constructor(private http: HttpClient,
                private config: ConfigurationService,
                private auth: AuthService)
    {

    }

    // DEPRECATED: apprently not needed for upload. Keeping around
    // just in case.
    public getUploadHeaders() : HttpHeaders
    {
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        return headers;

    }

    public createSoundboard(soundboard : Soundboard) : Observable<any>
    {
        var formData = new FormData();
        formData.append("name", soundboard.name.toString());
        soundboard.soundFiles.forEach(sound => {
            formData.append("soundNames[]", sound.name.toString());
            formData.append("files[]", sound.soundFile, sound.soundFile.name);
        });

        formData.append("files[]", soundboard.image, soundboard.image.name);
        const req = new HttpRequest('POST', 
            this.config.apiUrl + "/soundboards", formData, 
            { headers : this.auth.getAuthHeaders(), reportProgress : true});

        return this.http.request(req);
    }

    public getSoundboards(page : Number, query : String, type : String) : Observable<any>
    {
        return this.http.get(this.config.apiUrl + "/soundboards"
            + "?name=" + query + "&page="  + page + "&limit=" + this.config.paginationLimit 
            + "&type=" + type, { headers : this.auth.getAuthHeaders() });
    }

    public getSoundboard(id : String) : Observable<any>
    {
        return this.http.get(this.config.apiUrl + "/soundboards/" + id, 
                { headers : this.auth.getAuthHeaders() });
    }

    public deleteSoundboard(id: String) : Observable<any>
    {
        return this.http.delete(this.config.apiUrl + "/soundboards/" + id, 
                { headers : this.auth.getAuthHeaders() });
    }

    public favourite(id : String) : Observable<any>
    {
        return this.http.post(this.config.apiUrl + "/soundboards/favourite/" + id, 
            {}, { headers : this.auth.getAuthHeaders() });
    }

    public report(id : String, blockUser: String) : Observable<any>
    {
        return this.http.post(this.config.apiUrl + `/soundboards/report/${id}?blockUser=${blockUser}`, 
            {}, { headers : this.auth.getAuthHeaders() });
    }

    public getMySoundboards(query : String, page : Number) : Observable<any>
    {
        return this.http.get(this.config.apiUrl + "/mysoundboards"
            + "?type=" + query + "&page="  + page + "&limit=" + this.config.paginationLimit ,
            { headers : this.auth.getAuthHeaders() });
    }
}