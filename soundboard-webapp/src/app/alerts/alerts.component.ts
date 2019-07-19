import { Component, OnInit } from '@angular/core';
import { AlertsService } from './alerts.service';
import { Alert } from '../models/alert.model';

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

    public alerts : Alert[] = [];

    constructor(private _alertsService : AlertsService) { }

    ngOnInit() 
    {
        this._alertsService.newAlert.subscribe(
            (alert) => {
                this.handleNewAlert(alert);
            }
        )
    }

    public handleNewAlert(alert : Alert) : void
    {
        this.alerts.push(alert);
        setTimeout(() => {
            var index = this.alerts.indexOf(alert);
            if(index != -1)
            {
                this.alerts.splice(index, 1);
            }
        }, alert.duration);
    }

    public closeAlert(index : number) : void
    {
        this.alerts.splice(index, 1);
    }

}
