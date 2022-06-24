import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { stat } from 'fs';
import { CourseService } from 'src/app/core/services/courses/course.service';
import { PayuService } from 'src/app/core/services/payu/payu.service';
import Swal from 'sweetalert2';
import { CarrerasService } from '../../../../core/services/carreras/carreras.service';

@Component({
  selector: 'app-coupons-create',
  templateUrl: './coupons-create.component.html',
  styleUrls: ['./coupons-create.component.scss'],
})
export class CouponsCreateComponent implements OnInit {
  form: FormGroup;
  edit = false;
  couponId;
  coursesList: any;
  careersList: any;
  tipos: string[] = ['Curso', 'Carrera'];
  typeSelected: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cupon: PayuService,
    private parametros: ActivatedRoute,
    private courseService: CourseService,
    private careerService: CarrerasService,
  ) {
    this.couponId = this.parametros.snapshot.params.couponId;
    if (this.couponId) {
      this.edit = true;
    }
    this.buildForm();
  }

  ngOnInit(): void {
    if (this.edit) {
      this.getCouponInfo();
    }
    this.getCourses();
    this.getCareers();
  }

  getCouponInfo(): void {
    const couponReceived = this.cupon.getCoupon(this.couponId)
      .valueChanges()
      .subscribe(c => {
        this.cuponField.setValue(c.cupon);
        this.porcentajeField.setValue(c.porcentaje);
        this.activoField.setValue(c.activo);
        this.tipoField.setValue(c.tipo);
        this.cursoField.setValue(c.curso);
        this.typeSelected = c.tipo;
        couponReceived.unsubscribe();
      });
  }

  getCourses(): void {
    const courses = this.courseService.listCourses()
      .valueChanges()
      .subscribe(c => {
        this.coursesList = c;
        courses.unsubscribe();
      });
  }

  getCareers(): void {
    const careers = this.careerService.obtenerCarreras()
      .valueChanges()
      .subscribe(c => {
        this.careersList = c;
        careers.unsubscribe();
      });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      id: [0],
      cupon: ['', Validators.required],
      porcentaje: [0, Validators.required],
      activo: [true],
      tipo: ['', Validators.required],
      curso: ['', Validators.required],
    });
  }

  get cuponField(): AbstractControl {
    return this.form.get('cupon');
  }

  get porcentajeField(): AbstractControl {
    return this.form.get('porcentaje');
  }

  get activoField(): AbstractControl {
    return this.form.get('activo');
  }

  get tipoField(): AbstractControl {
    return this.form.get('tipo');
  }

  get cursoField(): AbstractControl {
    return this.form.get('curso');
  }

  saveOrEditCoupon(event: Event): void {
    event.preventDefault();
    // const xhr = new XMLHttpRequest();
    // const imgTest = 'assets/img/header-logo-custom1.png';

    // xhr.open('HEAD', imgTest, true);
    // xhr.send();

    // const processRequest = () => {
    //     if (xhr.readyState === 4) {
    //         if (xhr.status >= 200 && xhr.status < 304) {
    //             console.log('On line!');
                
    //         } else {
    //             console.log('Offline :(');
    //             Swal.fire('Error', 'No estas conectado a internet. Valida tu conexión y vuelve a inentarlo.', 'error');
    //         }
    //     }
    // };

    // xhr.addEventListener('readystatechange', processRequest, false);

    this.form.markAllAsTouched();
    if (this.form.valid) {
      // this.form.disable();
      if (!this.edit) {
        this.createCoupon();
      } else {
        this.editCoupon();
      }
    }
  }

  createCoupon(): void {
    // console.log(this.form.value);
    this.cupon
      .createCoupon(this.form.value)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Cupón creado exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.goBack();
      })
      .catch((err) => console.error(err));
  }

  editCoupon(): void {
    this.cupon
      .editCoupon(this.form.value, this.couponId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Exito!',
          text: 'Cupón actualizado exitosamente',
          confirmButtonText: 'cerrar',
        });
        this.goBack();
      })
      .catch((err) => console.error(err));
  }

  goBack(): void {
    this.router.navigate(['dashboard/cupones']);
  }

  typeSelectedEvent(event: MatSelectChange): void {
    console.log(event);
    this.typeSelected = event.value;
    console.log(this.typeSelected);
  }
}
