import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';
import { AdsService } from '../../../../core/services/ads/ads.service';
import { Router } from '@angular/router';

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

  constructor(
    private fireStorage: AngularFireStorage,
    private formAdsBuilder: FormBuilder,
    private fireStore: AngularFirestore,
    private adsService: AdsService,
    private route: Router
    )
    {
      this.fechaYHora = new Date();
      this.selectedImage = null;
      this.buildForm();
    }

  ngOnInit(): void {
  }

  private buildForm()
  {
    this.formAds = this.formAdsBuilder.group({
      name: ['', Validators.required,],
      image: ['', Validators.required],
      description: [''],
      fechaYHora: ['']
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

  get decriptionField() {
    return this.formAds.get('description');
  }

  get fechaYHoraFild() {
    return this.formAds.get('fechaYHora');
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
      timer: 5000,
      timerProgressBar: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }}).then(() => {
        this.uploadNewImage(datos);
      });
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
    this.adsService.createAds(datos, this.fsId, this.selectedImage.name)
    .then(() => {
      Swal.fire({
				icon: 'success',
				title: 'Exito!',
				text: 'Anuncio agregado exitosamente',
				confirmButtonText: 'cerrar',
			});
			this.route.navigate(['dashboard/ads/ads-list']);
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

}
