import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { SoundboardsService } from '../soundboards/soundboards.service';
import { AlertsService } from '../alerts/alerts.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-soundboard-list-item',
    templateUrl: './soundboard-list-item.component.html',
    styleUrls: ['./soundboard-list-item.component.css']
})
export class SoundboardListItemComponent implements OnInit {

    @Input("soundboard") _soundboard;

    constructor(private auth : AuthService,
                public config : ConfigurationService,
                private sbService : SoundboardsService,
                private alerts : AlertsService,
                private router : Router) { }

    ngOnInit() 
    {
    }

}
