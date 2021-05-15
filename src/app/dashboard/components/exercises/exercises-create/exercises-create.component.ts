import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-exercises-create',
  templateUrl: './exercises-create.component.html',
  styleUrls: ['./exercises-create.component.scss']
})
export class ExercisesCreateComponent implements OnInit {

  selected: number;
  pivSelected: number;

  options = [
    {
      name: 'Selección única',
      img: '/assets/icons/respuesta_unica.svg',
      value: 1,
      state: false
    },
    {
      name: 'Selección multiple',
      img: '/assets/icons/respuesta_multiple.svg',
      value: 2,
      state: false
    },
    {
      name: 'Rellenar blancos',
      img: '/assets/icons/rellenar_blancos.svg',
      value: 3,
      state: false
    },
    {
      name: 'Relacionar',
      img: '/assets/icons/relacionar.svg',
      value: 4,
      state: false
    },
    {
      name: 'Respuesta libre',
      img: '/assets/icons/respuesta_libre.svg',
      value: 5,
      state: false
    }
  ]

  answers = [
    {
      value: 1,
      true: false,
      punctuation: 0,
      answer: '',
      comment: '',
    },
    {
      value: 2,
      true: false,
      punctuation: 0,
      answer: '',
      comment: '',
    },
    {
      value: 3,
      true: false,
      punctuation: 0,
      answer: '',
      comment: '',
    },
    {
      value: 4,
      true: false,
      punctuation: 0,
      answer: '',
      comment: '',
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  selectionChange(event: MatRadioChange) {

    let pos;

    if (this.pivSelected) {
      pos = this.pivSelected - 1;
      this.options[pos].state = false;
    }
    this.pivSelected = this.selected;

    pos = event.value - 1;
    console.log(this.options[pos].name);
    this.options[pos].state = true;

  }

}
