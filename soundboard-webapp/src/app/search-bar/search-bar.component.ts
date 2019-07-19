import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

    @Input() searching : Boolean;
    @Output() onSearch = new EventEmitter<String>();

    constructor() 
    { 

    }

    ngOnInit() 
    {

    }

    public search(query : String) : void
    {
        this.onSearch.emit(query);
    }

}
