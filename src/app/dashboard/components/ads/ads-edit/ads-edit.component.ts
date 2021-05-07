import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdsService } from 'src/app/core/services/ads/ads.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ads-edit',
  templateUrl: './ads-edit.component.html',
  styleUrls: ['./ads-edit.component.scss']
})
export class AdsEditComponent implements OnInit {

  imageLocation:string;
  formAds: FormGroup;
  selectedImage: any;
  fechaYHora: Date;
  id: string;

  constructor(
    private fireStorage: AngularFireStorage,
    private formAdsBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private adsService: AdsService,
    private route: Router
  )
  {
    this.id = this.activatedRoute.snapshot.params.id
    this.fechaYHora = new Date();
    this.selectedImage = {};
    this.buildForm();
  }

  ngOnInit(): void {
    this.obtainAds();
  }

  private buildForm()
  {
    this.formAds = this.formAdsBuilder.group({
      name: ['', Validators.required,],
      image: ['', Validators.required],
      imageName:[''],
      description: [''],
      fechaYHora: ['']
    })
  }

  obtainAds():void
  {
    this.adsService.obtainAds(this.id)
    .valueChanges()
    .subscribe(ads => this.setValuesFormAds(ads))
  }

  setValuesFormAds(ads: any):void
  {
    this.nameField.setValue(ads.nombre);
    this.decriptionField.setValue(ads.descripcion);
    this.imageField.setValue(ads.imagen);
    this.imageNameField.setValue(ads.nombreImg);
    this.showUploadedImage(ads.imagen);
    this.uploadedImageLocation(ads);
  }

  showUploadedImage(imageUrl:string)
  {
    this.selectedImage.src = imageUrl;
  }

  uploadedImageLocation(ads: any):void
  {
    this.imageLocation = `ads/${ads.id}/${ads.nombreImg}`;
  }

  cancelar()
  {
    this.route.navigate(['dashboard/ads/ads-list']);
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

    get imageNameField()
    {
      return this.formAds.get('imageName')
    }

    /*Editar ads*/
    editAds(data:any):void
    {
      this.showMessageSend();
      this.deleteUploadedImage(data);
    }

    showMessageSend()
    {
      Swal.fire({
        html: '<h1 style="color: white;">Se está actualizando el anuncio, un momento por favor</h1>',
        background: 'rgba(0,0,0,.5)',
        showConfirmButton: false,
        backdrop: true,
        timer: 1000,
        timerProgressBar: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        }})
    }

    deleteUploadedImage(data:any):void
    {
      const image = data.image;
      if(typeof image !== 'string')
      {
        this.fireStorage.ref(this.imageLocation).delete();
        this.uploadNewImage(image);
      }
      else
      {
        this.sendUpdatedData(data);
      }
    }

    uploadNewImage(image:any):void
    {
      const name = image.name;
      const fileRef = this.fireStorage.ref(`ads/${this.id}/${name}`);
      const path = `ads/${this.id}/${name}`
      this.fireStorage.upload(path, image).then(() => {
        const urlImagen = fileRef.getDownloadURL();
        urlImagen.subscribe( url => {
          this.imageField.setValue(url);
          this.imageNameField.setValue(name);
          this.sendUpdatedData(this.formAds.value);
        });
      });
    }

    sendUpdatedData(data:any):void
    {
      this.adsService.editAds(data,this.id,this.fechaYHora)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Anuncio actualizado exitosamente',
          confirmButtonText: 'cerrar',
        }).then(() => this.route.navigate(['dashboard/ads/ads-list']));
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
