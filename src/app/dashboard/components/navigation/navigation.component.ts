import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  panelOpenState = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logguedUser;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private route: Router,
  ) {
    this.logguedUser={}
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      //console.log(user);
      this.logguedUser = user;
    });
  }

  goToProfile() {
    this.route.navigate([`/usuarios/perfil/${this.logguedUser.id}`]);
  }

  goToCoursesList() {
    this.route.navigate([`/dashboard/cursos/list/${this.logguedUser.id}`])
  }

  goToMyCourses() {
    this.route.navigate([`/dashboard/mis-cursos/${this.logguedUser.id}`])
  }

  logout():void {
    this.auth.logout();
    this.route.navigate(['/home']);
  }

}
