import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../ads-curso.component';

@Component({
  selector: 'app-modal-vista-ads',
  templateUrl: './modal-vista-ads.component.html',
  styleUrls: ['./modal-vista-ads.component.scss']
})
export class ModalVistaAdsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) 
  { 
  }

  ngOnInit(): void {
  }

  parseHTML(data) {
    let ads = document.getElementById('ads-content')
    ads.innerHTML = data;
  }

}
