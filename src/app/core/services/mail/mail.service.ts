import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  headers:any;
  constructor(private http: HttpClient)
  {
    this.headers= { 'content-type': 'application/json'};
  }

  sendEmailMultiple(data:any)
  {
    const url = `http://chym.esy.es/phpMailer/correosMultiples.php`;
    return this.http.post(url,JSON.stringify(data), {headers:this.headers});
  }

  sendEmailContacto(data:any)
  {
    const url = `http://chym.esy.es/phpMailer/contacto.php`;
    return this.http.post(url,JSON.stringify(data), {headers:this.headers});
  }

  sendEmailIndividual(data:any)
  {
    const url = `http://chym.esy.es/phpMailer/correoIndividual.php`;
    return this.http.post(url,JSON.stringify(data), {headers:this.headers});
  }

  sendEmailAnuncios(data:any)
  {
    const url = `http://chym.esy.es/phpMailer/correosAnuncios.php`;
    return this.http.post(url,JSON.stringify(data), {headers:this.headers});
  }

}
