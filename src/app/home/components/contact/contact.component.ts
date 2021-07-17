import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../../core/services/contact/contact.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MailService } from 'src/app/core/services/mail/mail.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss','../../../../assets/font/flaticon.css']
})
export class ContactComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private contact: ContactService,
    private route: Router,
    private mailService:MailService
  ) {
    this.buildForm();
   }

  ngOnInit(): void {
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required,],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      mensaje: ['', Validators.required],
    })
  }

  get nombreField() {
    return this.form.get('nombre');
  }

  get emailField() {
    return this.form.get('email');
  }

  get telefonoField() {
    return this.form.get('telefono');
  }

  get mensajeField() {
    return this.form.get('mensaje');
  }

  submitMessage(event: Event) {
    const data = this.form.value;
    console.log(data);
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.contact.postMessage(data)
        .subscribe(response => {
          //location.href = 'https://mailthis.to/confirm';
          
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Mensaje enviado satisafctoriamente, pronto nos comunicaremos.',
            confirmButtonText: 'cerrar',
          });
          this.form.reset()
          this.route.navigate(['https://mailthis.to/confirm']);
          console.log(response);
        }, error => {
          console.warn(error.responseText);
          console.log({error});
        });
	  }
  }

 async mailContacto()
  {
    if(this.form.valid)
    {
      const data = this.form.value;
      await this.mailService.sendEmailContacto(data)
      .toPromise()
      .then(()=>this.mailEnviadoExitosamente(),
      ()=>this.mensajeErrorAlEnviarEmail());
    }
    else
    {
      this.mensajeFormularioContactoIncompleto();
    }
  }

  mensajeErrorAlEnviarEmail()
  {
    Swal.fire({
      icon: 'error',
      title: 'No enviado',
      html: 'El formulario no pudo ser enviado por problemas de conexión, por favor disculpe las molestias'
    })
  }

  mailEnviadoExitosamente()
  {
    this.mensajeMailContactoEnviado();
    this.resetFormulario();
  }

  mensajeMailContactoEnviado()
  {
    Swal.fire({
      icon:'success',
      title:'Enviado',
      html: 'El formulario ha sido enviado exitosamente'
    })
  }

  resetFormulario()
  {
    this.form.reset();
  }

  mensajeFormularioContactoIncompleto()
  {
    Swal.fire({
      title: 'Formulario incompleto',
      html: 'Los campos Nombre, Email y Mensaje no pueden estar vacios'
    })
  }

}
