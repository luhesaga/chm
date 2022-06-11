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
    this.logguedUser = {};
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.logguedUser = user;
    });
  }

  goToProfile(): void {
    this.route.navigate([`/usuarios/perfil/${this.logguedUser.id}`]);
  }

  goToCoursesList(): void {
    this.route.navigate([`/dashboard/cursos/list/${this.logguedUser.id}`]);
  }

  goToCarreraCatalogo(): void {
    this.route.navigate([`/dashboard/carreras/catalogo/${this.logguedUser.id}`]);
  }

  goToMyCourses(): void {
    this.route.navigate([`/dashboard/mis-cursos/${this.logguedUser.id}`]);
  }

  goToMyCareers(): void {
    this.route.navigate([`/dashboard/mis-carreras/${this.logguedUser.id}`])
  }

  goToMyCertificates(): void {
    this.route.navigate([`dashboard/mis-certificados/${this.logguedUser.id}`]);
  }

  goToAdmCertificates(): void {
    this.route.navigate(['dashboard/certificados']);
  }

  goToCetificates(): void {
    this.route.navigate([`dashboard/consulta-certificados`]);
  }

  goToCoupons(): void {
    this.route.navigate([`dashboard/cupones`]);
  }

  goToPayments(): void {
    this.route.navigate([`dashboard/adm-pagos`]);
  }

  goToMyPayments(): void {
    this.route.navigate([`dashboard/mis-pagos/${this.logguedUser.id}`]);
  }

  logout(): void {
    this.auth.logout();
    this.route.navigate(['/home']);
  }

}
