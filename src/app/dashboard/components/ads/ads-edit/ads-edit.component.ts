import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { AdsService } from 'src/app/core/services/ads/ads.service';
import { MailService } from 'src/app/core/services/mail/mail.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ads-edit',
  templateUrl: './ads-edit.component.html',
  styleUrls: ['./ads-edit.component.scss'],
})
export class AdsEditComponent implements OnInit {
  imageLocation: string;
  formAds: FormGroup;
  selectedImage: any;
  fechaYHora: Date;
  id: string;
  updateTime: boolean;
  fechaCaducidadAEnviar: Date;
  correosUsuarios: any[];
  sendEmailAgain: boolean;

  constructor(
    private fireStorage: AngularFireStorage,
    private formAdsBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private adsService: AdsService,
    private route: Router,
    private userService: UsersService,
    private mailService: MailService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.fechaYHora = new Date();
    this.selectedImage = {};
    this.updateTime = false;
  }

  ngOnInit(): void {
    this.buildForm();
    this.obtainAds();
    this.obtenerUsuarios();
  }

  private buildForm(): void {
    this.formAds = this.formAdsBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      imageName: [''],
      description: [''],
      fechaCaducidad: ['', Validators.required],
      fechaYHora: [''],
    });
  }

  obtainAds(): void {
    this.adsService
      .obtainAds(this.id)
      .valueChanges()
      .subscribe((ads) => this.setValuesFormAds(ads));
  }

  setValuesFormAds(ads: any): void {
    this.nameField.setValue(ads.nombre);
    this.decriptionField.setValue(ads.descripcion);
    this.imageField.setValue(ads.imagen);
    this.imageNameField.setValue(ads.nombreImg);
    this.cambiarFormatoFechaCaducidadString(ads.fechaCaducidad.toDate());
    this.showUploadedImage(ads.imagen);
    this.uploadedImageLocation(ads);
  }

  cambiarFormatoFechaCaducidadString(fecha: Date): void {
    this.fechaCaducidadAEnviar = fecha;
    const dia = this.formatoDiasMes(fecha.getDate(), 'dia');
    const mes = this.formatoDiasMes(fecha.getMonth(), 'mes');
    const ano = fecha.getFullYear();
    this.fechaCaducidad.setValue(`${ano}-${mes}-${dia}`);
  }

  formatoDiasMes(numero: number, tipo: string): string {
    let numeroString: string;
    if (tipo === 'mes') {
      ++numero;
    }
    if (numero < 10) {
      numeroString = '0' + numero;
    } else {
      numeroString = '' + numero;
    }
    return numeroString;
  }

  showUploadedImage(imageUrl: string): void {
    this.selectedImage.src = imageUrl;
  }

  uploadedImageLocation(ads: any): void {
    this.imageLocation = `ads/${ads.id}/${ads.nombreImg}`;
  }

  cancelar(): void {
    this.route.navigate(['dashboard/ads/ads-list']);
  }

  /*Imagen*/
  newImage(event): void {
    this.imageField.setValue(event.target.files[0]);
    this.lastSelectedImage();
  }

  lastSelectedImage(): void {
    if (this.imageField.value) {
      this.selectedImage = this.imageField.value;
      this.imageURL();
    } else {
      this.imageField.setValue(this.selectedImage);
    }
  }

  imageURL(): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.selectedImage.src = event.target.result;
    };
    reader.readAsDataURL(this.selectedImage);
  }

  /* Obtener Campos del formulario */
  get imageField(): AbstractControl {
    return this.formAds.get('image');
  }

  get nameField(): AbstractControl {
    return this.formAds.get('name');
  }

  get decriptionField(): AbstractControl {
    return this.formAds.get('description');
  }

  get fechaYHoraFild(): AbstractControl {
    return this.formAds.get('fechaYHora');
  }

  get imageNameField(): AbstractControl {
    return this.formAds.get('imageName');
  }

  get fechaCaducidad(): AbstractControl {
    return this.formAds.get('fechaCaducidad');
  }

  /*Editar ads*/
  editAds(data: any): void {
    this.showMessageSend();
    this.deleteUploadedImage(data);
  }

  showMessageSend(): void {
    Swal.fire({
      html: '<h1 style="color: white;">Se está actualizando el anuncio, un momento por favor</h1>',
      background: 'rgba(0,0,0,.5)',
      showConfirmButton: false,
      backdrop: true,
      timer: 2000,
      timerProgressBar: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  }

  deleteUploadedImage(data: any): void {
    const image = data.image;
    if (typeof image !== 'string') {
      this.fireStorage.ref(this.imageLocation).delete();
      this.uploadNewImage(image);
    } else {
      this.sendUpdatedData(data);
    }
  }

  uploadNewImage(image: any): void {
    const name = image.name;
    const fileRef = this.fireStorage.ref(`ads/${this.id}/${name}`);
    const path = `ads/${this.id}/${name}`;
    this.fireStorage.upload(path, image).then(() => {
      const urlImagen = fileRef.getDownloadURL();
      urlImagen.subscribe((url) => {
        this.imageField.setValue(url);
        this.imageNameField.setValue(name);
        this.sendUpdatedData(this.formAds.value);
      });
    });
  }

  sendUpdatedData(data: any): void {
    if (this.updateTime) {
      this.upDateWithTime(data);
    } else {
      this.upDateWithOutTime(data);
    }
  }

  upDateWithTime(data: any): void {
    data.fechaCaducidad = this.fechaCaducidadAEnviar;
    this.adsService
      .editAds(data, this.id, this.fechaYHora)
      .then(() => {
        if (!this.sendEmailAgain) {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Anuncio actualizado exitosamente',
            confirmButtonText: 'cerrar',
          }).then(() => {
            console.log('actualizado sin envio de correo.');
            this.route.navigate(['dashboard/ads/ads-list']);
          });
        } else {
          console.log('enviando correos...');
          this.sendEmailAnuncio(data.image);
        }
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

  upDateWithOutTime(data: any): void {
    data.fechaCaducidad = this.fechaCaducidadAEnviar;
    this.adsService
      .editAdsWithOutTime(data, this.id)
      .then(() => {
        if (!this.sendEmailAgain) {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Anuncio actualizado exitosamente',
            confirmButtonText: 'cerrar',
          }).then(() => {
            console.log('actualizado sin envio de correo.');
            this.route.navigate(['dashboard/ads/ads-list']);
          });
        }
        else {
          console.log('enviando correos...');
          this.sendEmailAnuncio(data.image);
        }
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

  timeUpdate($event: MatSlideToggleChange): void {
    this.updateTime = $event.checked;
  }

  sendEmails($event: MatSlideToggleChange): void {
    this.sendEmailAgain = $event.checked;
  }

  cambiarFormatoFechaCaducidad(): void {
    const fechaCaducidadCadena: string = this.fechaCaducidad.value;
    const fechaCaducidad = new Date();
    fechaCaducidad.setMonth(Number(fechaCaducidadCadena.substring(5, 7)) - 1);
    fechaCaducidad.setDate(Number(fechaCaducidadCadena.substring(8, 10)));
    fechaCaducidad.setFullYear(Number(fechaCaducidadCadena.substring(0, 4)));
    fechaCaducidad.setHours(0, 0, 0);
    this.fechaCaducidadAEnviar = fechaCaducidad;
  }

  obtenerUsuarios(): void {
    this.userService
      .listUsers()
      .valueChanges()
      .subscribe((users) => {
        this.validarUsuariosActivos(users);
      }
      );
  }

  validarUsuariosActivos(users: any): void {
    const usuariosActivos = [];
    users.forEach((user: any) => {
      if (!user.eliminado) {
        usuariosActivos.push(user);
      }
    });
    this.obtenerCorreoUsuario(usuariosActivos);
  }

  obtenerCorreoUsuario(users: any[]): void {
    const correos = [];
    users.forEach((user) => correos.push(user.correo));
    this.correosUsuarios = correos;
  }

  async sendEmailAnuncio(img: string): Promise<void> {
    const data = { img };
    /*convertir el array en objeto, poner los datos en la constante data
    y todo hacerlo un objeto tipo JSON*/
    JSON.stringify(Object.assign(data, this.correosUsuarios));
    await this.mailService
      .sendEmailAnuncios(data)
      .toPromise()
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Anuncio editado exitosamente',
            confirmButtonText: 'cerrar',
          }).then(() => this.route.navigate(['dashboard/ads/ads-list']));
        },
        (e) => {
          console.log(e);
          Swal.fire({
            icon: 'error',
            title: 'Correos',
            text: 'Los correos no pudieron ser enviados.',
            confirmButtonText: 'cerrar',
          }).then(() => this.route.navigate(['dashboard/ads/ads-list']));
        }
      );
  }
}
