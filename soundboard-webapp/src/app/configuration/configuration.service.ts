import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"

@Injectable()
export class ConfigurationService 
{
    // REST API URL
    private _apiUrl : String = environment.apiUrl;

    // reCaptcha2 Public Key
    private _reCaptchaPublicKey : String = environment.reCaptchaPublicKey;

    // Timout for user alers in milliseconds
    private _alertTimeoutInMs : Number = 5000;

    // Max number of results per page for pagination
    private _paginationLimit : Number = 5;

    // Maximum size per file
    private _maxFileSize : Number = 2500000; // 2.5MB in Bytes

    get apiUrl() : String 
    {
        return this._apiUrl;
    }

    get reCaptchaPublicKey() : String 
    {
        return this._reCaptchaPublicKey;
    }

    get alertTimeoutInMs() : Number
    {
        return this._alertTimeoutInMs;
    }

    get paginationLimit() : Number
    {
        return this._paginationLimit;
    }

    get maxFileSize() : Number
    {
        return this._maxFileSize;
    }
}