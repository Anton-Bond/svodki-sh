import { Component, OnInit } from '@angular/core';
import { uStyles } from './not-found.component.Styles';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
    uStyles = uStyles

    constructor() { }

    ngOnInit(): void {
    }
}
