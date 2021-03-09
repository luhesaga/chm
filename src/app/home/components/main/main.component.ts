import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  tag;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(link => {
      this.tag = link.tag;
      this.scrollToElement();
      console.log(this.tag);
    });
  }

  scrollToElement(): void {

    if (this.tag) {
      if (this.tag === 'inicio') {
        this.router.navigate(['home']);
        window.scrollTo(0, 0);
      } else {
        const element = document.querySelector(`#${this.tag}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }

}
