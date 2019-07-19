import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Alert } from "../models/alert.model";

@Injectable()
export class AlertsService 
{
    public newAlert = new Subject<Alert>();

    public showAlert(type : String, message : String, 
                    duration : Number, dismissable : Boolean) : void
    {
        this.newAlert.next(new Alert(type, message, duration, dismissable));
    }
}