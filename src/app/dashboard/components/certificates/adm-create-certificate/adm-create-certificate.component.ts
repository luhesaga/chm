import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CerticateService } from 'src/app/core/services/certificate/certicate.service';
import { UsersService } from '../../../../core/services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adm-create-certificate',
  templateUrl: './adm-create-certificate.component.html',
  styleUrls: ['./adm-create-certificate.component.scss']
})
export class AdmCreateCertificateComponent implements OnInit {

  form: FormGroup;

  types: string [] = ['Certificacion', 'Asistencia', 'Aprobacion'];
  siglas: string[] = ['CE', 'AS', 'AP'];
  siglaTiposSelected: string;
  selectedType;

  Tecnicas: any = [];
  siglaTecnicaSelected: string;
  clientes: any = [];
  clientesFiltrados: Observable<string[]>;
  cliente;
  consStr: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private certificate: CerticateService,
    private usrSrvc: UsersService,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.getTecnicas();
    this.getUsers();
    this.setStdFilters();
    this.getCertCons();
  }

  setStdFilters() {
    this.clientesFiltrados = this.estudianteField.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter(value)
      }),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.clientes.filter(option => `${option.nombres} ${option.apellidos}`.toLowerCase().includes(filterValue));
  }

  getTecnicas() {
    this.Tecnicas = this.certificate.tecnicas;
  }

  getUsers() {
    let users = this.usrSrvc.listStudents()
      .valueChanges()
      .subscribe(std => {
        std.forEach((s: any) => {
          this.clientes = std;
        });
        users.unsubscribe();
      });
  }

  getCertCons() {
    let cons = this.certificate.getConsecutive()
      .valueChanges()
      .subscribe((c: any) => {
        if (c.valor <= 9) {
          this.consStr = `00${c.valor}`;
        } else if (c.valor > 9 && c.valor <= 99 ) {
          this.consStr = `0${c.valor}`;
        } else {
          this.consStr = `${c.valor}`;
        }
        this.idField.setValue(c.valor);
        cons.unsubscribe();
      });
  }

  goBack() {
    this.route.navigate(['dashboard/certificados']);
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      id: [0],
      certificado: [''],
      fechaFin: ['', Validators.required],
      fechaExp: [''],
      tecnica: ['', Validators.required],
      estudiante: ['', Validators.required],
      identificacion: ['', Validators.required],
      tipo: ['', Validators.required],
      observacion: [''],
    })
  }

  get idField() {
    return this.form.get('id');
  }

  get certificadoField() {
    return this.form.get('certificado');
  }

  get fechaFinField() {
    return this.form.get('fechaFin');
  }

  get fechaExpField() {
    return this.form.get('fechaExp');
  }

  get tecnicaField() {
    return this.form.get('tecnica');
  }

  get estudianteField() {
    return this.form.get('estudiante');
  }

  get identificacionField() {
    return this.form.get('identificacion');
  }

  get tipoField() {
    return this.form.get('tipo');
  }

  get observacionField() {
    return this.form.get('observacion');
  }

  saveOrEditCert(event: Event) {
    event.preventDefault();

    this.form.markAllAsTouched();
    if (this.form.valid) {
      // this.form.disable();
      this.certificate.saveNewCert(this.form.value)
        .then(() => {
          this.certificate.setConsecutive(this.idField.value + 1)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Exito!',
                text: 'Certificado creado exitosamente',
                confirmButtonText: 'cerrar',
              });
              this.goBack();
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    }
  }

  DateChanged() {
    this.setCertificate();
  }

  tecnicaChanged(event) {
    this.siglaTecnicaSelected = event.value.sigla;
    this.setCertificate();
  }

  typeChanged(event) {
    const pos = this.types.indexOf(event.value);
    this.siglaTiposSelected = pos >= 0 ? this.siglas[pos] : '';
    this.setCertificate();
  }

  setCertificate() {
    const tipo = this.siglaTiposSelected ? this.siglaTiposSelected : '';
    const tecnica = this.siglaTecnicaSelected ? this.siglaTecnicaSelected: '';
    const fecha = this.setDate();
    const cons = this.consStr ? this.consStr : '';
    this.certificadoField.setValue(`${tipo}-${tecnica}-${fecha}-${cons}`);
  }

  setDate(): string {
    const fecha = this.fechaFinField.value ? new Date(this.fechaFinField.value) : null;
    const year = fecha ? fecha.getFullYear().toString().substring(2) : '';
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const month = fecha ? months[fecha.getMonth()] : '';
    return fecha ? `${month}${year}` : '';
  }

  userSelected(event) {
    const found = this.clientes.find(element => `${element.nombres} ${element.apellidos}` === event.option.value);
    if (found) {
      this.identificacionField.setValue(found.identificacion);
    } else {
      this.identificacionField.setValue('');
    }
  }

}
