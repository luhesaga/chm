import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';
import { AdsService } from '../../../../core/services/ads/ads.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MailService } from 'src/app/core/services/mail/mail.service';

@Component({
  selector: 'app-ads-create',
  templateUrl: './ads-create.component.html',
  styleUrls: ['./ads-create.component.scss']
})
export class AdsCreateComponent implements OnInit {

  fsId:string;
  formAds: FormGroup;
  selectedImage: any;
  fechaYHora: Date;
  correosUsuarios:any[];
  fechaCaducidadAEnviar: Date;

  constructor(
    private userService: UsersService,
    private fireStorage: AngularFireStorage,
    private formAdsBuilder: FormBuilder,
    private fireStore: AngularFirestore,
    private adsService: AdsService,
    private route: Router,
    private mailService: MailService,
    )
    {
      this.fechaYHora = new Date();
      this.selectedImage = null;
      this.buildForm();
      this.obtenerUsuarios();
    }

  ngOnInit(): void {
  }

  private buildForm()
  {
    this.formAds = this.formAdsBuilder.group({
      name: ['', Validators.required,],
      image: ['', Validators.required],
      description: [''],
      fechaYHora: [''],
      fechaCaducidad: ['', Validators.required]
    })
  }

  obtenerUsuarios()
  {
    this.userService.listUsers()
    .valueChanges()
    .subscribe(users => this.obtenerCorreoUsuario(users),
    ()=> this.mensajeErrorObtenerUsuario());
  }

  obtenerCorreoUsuario(users:any[])
  {
    const correos =[];
    users.forEach(user => correos.push(user.correo));
    this.correosUsuarios = correos;
  }

  mensajeErrorObtenerUsuario()
  {
    Swal.fire({
      icon: 'error',
      title: 'Conexión',
      html: 'Hay problemas de conexión por favor recargue la pagina'
    })
  }

  cancelar()
  {
    this.route.navigate(['dashboard/ads/ads-list']);
  }

  /* Obtener Campos del formulario */
  get imageField()
  {
    return this.formAds.get('image');
  }

  get nameField() {
    return this.formAds.get('name');
  }

  get fechaCaducidad() {
    return this.formAds.get('fechaCaducidad');
  }

  get decriptionField() {
    return this.formAds.get('description');
  }

  get fechaYHoraFild() {
    return this.formAds.get('fechaYHora');
  }

  cambiarFormatoFechaCaducidad()
  {
    let fechaCaducidadCadena:string=this.fechaCaducidad.value;
    let fechaCaducidad = new Date();
    fechaCaducidad.setMonth((Number(fechaCaducidadCadena.substring(5,7))-1));
    fechaCaducidad.setDate(Number(fechaCaducidadCadena.substring(8,10)));
    fechaCaducidad.setFullYear(Number(fechaCaducidadCadena.substring(0,4)));
    fechaCaducidad.setHours(0,0,0);
    const fechaActual = new Date();
    if(fechaCaducidad.getFullYear()>=fechaActual.getFullYear())
    {
      if(fechaCaducidad.getMonth()>=fechaActual.getMonth())
      {
        if(fechaCaducidad.getDate()>fechaActual.getDate())
        {
          this.fechaCaducidadAEnviar = fechaCaducidad;
          console.log(this.fechaCaducidadAEnviar);
        }
        else
        {
          this.mensajeValidacionFechaCaducidad();
        }
      }
      else
      {
        this.mensajeValidacionFechaCaducidad();
      }
    }
    else
    {
      this.mensajeValidacionFechaCaducidad();
    }

  }

  mensajeValidacionFechaCaducidad()
  {
    Swal.fire({
      icon: 'info',
      title:'Fecha de caducidad',
      text:'Debe ser mayor a la fecha de HOY',
      confirmButtonText: 'Aceptar'
    }).then(()=>this.resetFechaCaducidad());
  }

  resetFechaCaducidad()
  {
    this.fechaCaducidad.setValue('');
  }

  /*Imagen*/

  newImage(event):void
  {
    this.imageField.setValue (event.target.files[0]);
    this.lastSelectedImage();
  }

  lastSelectedImage(): void
  {
    if(this.imageField.value)
    {
      this.selectedImage = this.imageField.value;
      this.imageURL();
    }
    else
    {
      this.imageField.setValue(this.selectedImage);
    }
  }

  imageURL():void
  {
    const reader = new FileReader();
    reader.onload = (event) =>
    {
      this.selectedImage.src = event.target.result;
    }
    reader.readAsDataURL(this.selectedImage);
  }

  /*Subir todo*/

  saveAds(datos:any):void
  {
    Swal.fire({
      html: '<h1 style="color: white;">Se está creando el anuncio, un momento por favor</h1>',
      background: 'rgba(0,0,0,.5)',
      showConfirmButton: false,
      backdrop: true,
      timerProgressBar: false,
      onBeforeOpen: () => {
        Swal.showLoading();
        this.uploadNewImage(datos);
      }})
  }

  uploadNewImage(datos:any):void
  {
    this.fsId = this.fireStore.createId();
    const image = this.selectedImage;
    const name = image.name;
    const fileRef = this.fireStorage.ref(`ads/${this.fsId}/${name}`);
    const path = `ads/${this.fsId}/${name}`
    this.fireStorage.upload(path, image).then(() => {
      const urlImagen = fileRef.getDownloadURL();
      urlImagen.subscribe( url => {
        datos.image = url;
        this.sendDatosAdsService(datos);
      });
    });
  }

  sendDatosAdsService(datos:any)
  {
    datos.fechaYHora = this.fechaYHora;
    datos.fechaCaducidad = this.fechaCaducidadAEnviar;
    this.adsService.createAds(datos, this.fsId, this.selectedImage.name)
    .then(() => {
      this.sendEmailAnuncio(datos.image);
    })
    .catch((error) => {
			Swal.fire({
				icon: 'error',
				title: 'error',
				text: 'Ocurrió un error' + error,
				confirmButtonText: 'cerrar',
            });
        });
  }

  async sendEmailAnuncio(img:string)
  {
    const data = {img}
    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(data, this.correosUsuarios));
    await this.mailService.sendEmailAnuncios(data).toPromise()
    .then(()=> {
      Swal.fire({
				icon: 'success',
				title: 'Exito!',
				text: 'Anuncio agregado exitosamente',
				confirmButtonText: 'cerrar',
			}).then(()=>this.route.navigate(['dashboard/ads/ads-list']));
    }, (e)=> {
      console.log(e);
      Swal.fire({
				icon: 'error',
				title: 'Correos',
				text: 'Los correos no pudieron ser enviados.',
				confirmButtonText: 'cerrar',
			}).then(()=>this.route.navigate(['dashboard/ads/ads-list']));
    });
  }

}
