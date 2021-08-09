import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { CourseService } from 'src/app/core/services/courses/course.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../documents.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-documents',
  templateUrl: './modal-documents.component.html',
  styleUrls: ['./modal-documents.component.scss']
})
export class ModalDocumentsComponent implements OnInit, AfterViewInit {

  inputValor:any;
  fileUpload:any;
  validarSubida:string;

  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nombre', 'accion'];
  dataSource = new MatTableDataSource();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fireStorage: AngularFireStorage,
    private fireStore: AngularFirestore,
    private courseService: CourseService
  ) { 
    this.validarSubida='';
    this.obtenerDocumentos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
  }

  obtenerDocumentos()
  {
    this.courseService.getDocuments(this.data.cursoId)
    .valueChanges()
    .subscribe(documents => this.dataSource.data = documents);
  }

  validarSize(evento:FileList)
  {
    if(evento[0].size>20000000)
    {
      this.inputValor ='';
      this.fileUpload = {};
      this.validarSubida='mayor'
    }
    else
    {
      this.validarSubida=''
      this.cargandoDocumento()
      this.fileUpload=evento.item(0);
      this.subirDocumento()
    }
  }

  subirDocumento()
  {
    let id = this.fireStore.createId();
    let path = `documentos/${id}/${this.fileUpload.name}`
    this.fireStorage.upload(path, this.fileUpload).then(()=>{
      this.fireStorage.ref(`documentos/${id}/${this.fileUpload.name}`)
      .getDownloadURL()
      .subscribe(url => {
        const data ={
          nombreArchivo:this.fileUpload.name,
          archivo:url
        }
        this.agregarDocumento(data, id);
      },
      ()=>{
        Swal.close();
        this.mensajeErrorEliminar('No se pudo subir el documento, por favor inténtelo otra vez')
      });
    });
  }

  agregarDocumento(data:any , idDocument:string)
  {
    this.courseService.createDocuments(this.data.cursoId, idDocument, data)
    .then(()=>{
      Swal.close();
      this.documentoSubido();
    },
    ()=> {
      Swal.close();
      this.mensajeErrorEliminar('No se pudo subir el documento, por favor inténtelo otra vez');
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarArchivoFireStorage(idDocument:string, nombre:string)
  {
    const url =`documentos/${idDocument}/${nombre}`;
    this.fireStorage.ref(url).delete().subscribe(()=> {});
  }

  mensajeErrorEliminar(mensaje:string)
  {
    Swal.fire({
      icon:'error',
      text: mensaje,
      confirmButtonText: 'Cerrar'
    });
  }

  eliminarArchivoFireStore(idDocument:string, nombre:string)
  {
    this.courseService.deleteDocuments(this.data.cursoId, idDocument).then(()=>{
      this.eliminarArchivoFireStorage(idDocument, nombre);
    },
    ()=> {this.mensajeErrorEliminar('No se pudo eliminar el documento, por favor inténtelo otra vez')}
    );
  }

  mensajeValidacionDocumento(idDocument:string, nombre:string)
  {
    Swal.fire({
      icon: 'question',
      text: '¿Seguro desea eliminar el documento?',
      confirmButtonText: 'Si',
      confirmButtonColor: 'red',
      showCancelButton: true,
      cancelButtonText:'No',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if(result.value)
      {
        this.eliminarArchivoFireStore(idDocument, nombre);
      }
    })
  }

  cargandoDocumento()
  {
    Swal.fire({
      confirmButtonColor: '#007279',
      title: 'Cargando ...',
      text:' subiendo el documento',
      didOpen:()=>{
        Swal.showLoading();
      }
    })
  }

  documentoSubido()
  {
    Swal.fire({
      icon: 'success',
      confirmButtonText:'Aceptar',
      title: 'Documento subido exitosamente',
    })
  }

}
