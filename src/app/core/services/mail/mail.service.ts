import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  headers: any;
  constructor(private http: HttpClient) {
    this.headers = { 'content-type': 'application/json' };
  }

  sendEmailMultiple(data: any) {
    const url = `https://chym-ndt.com/phpMailer/correosMultiples.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  sendEmailContacto(data: any) {
    const url = `https://chym-ndt.com/phpMailer/contacto.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  sendEmailIndividual(data: any) {
    const url = `https://chym-ndt.com/phpMailer/correoIndividual.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  sendEmailAnuncios(data: any) {
    const url = `https://chym-ndt.com/phpMailer/correosAnuncios.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

  sendEmailAnuncioCurso(data: any) {
    const url = `https://chym-ndt.com/phpMailer/correroAnuncioCurso.php/`;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }

}
