import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  headers: any;
  constructor(private http: HttpClient) {
    this.headers = { 'content-type': 'application/json' };
  }

  sendEmailMultiple(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/correosMultiples.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  sendEmailContacto(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/contacto.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  courseRegistration(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/registroCurso.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  careerRegistration(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/registroCarrera.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  exerciseRevition(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/revisionEjercicioStd.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  forumRevition(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/revisionForoStd.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }


  sendEmailIndividual(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/correoIndividual.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  sendEmailAnuncios(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/correosAnuncios.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  sendEmailAnuncioCurso(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/correroAnuncioCurso.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  sendRevitionValidation(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/revisionEjercicio.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  daysValidationEmail(data: any): any {
    const url = `https://chym-ndt.com/phpMailer/daysValidation.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }
}
