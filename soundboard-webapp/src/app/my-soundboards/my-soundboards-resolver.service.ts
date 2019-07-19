import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Soundboard } from "../models/soundboard.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { SoundboardsService } from "../soundboards/soundboards.service";

@Injectable()
export class MySoundboardsResolver implements Resolve<Soundboard>
{
    constructor( private sbService : SoundboardsService)
    {}

    public resolve(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) :
        Observable<any> | Promise<any> | any  
    {
        return this.sbService.getMySoundboards("created", 1);
    }
}