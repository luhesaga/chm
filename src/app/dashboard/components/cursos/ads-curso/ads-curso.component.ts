import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ads-curso',
  templateUrl: './ads-curso.component.html',
  styleUrls: ['./ads-curso.component.scss']
})
export class AdsCursoComponent implements OnInit {


  idCurso: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.idCurso = this.activatedRoute.snapshot.params.idCurso;
    console.log(this.idCurso);
  }

  ngOnInit(): void {
  }

}
