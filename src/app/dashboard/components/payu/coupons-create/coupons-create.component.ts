import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PayuService } from 'src/app/core/services/payu/payu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coupons-create',
  templateUrl: './coupons-create.component.html',
  styleUrls: ['./coupons-create.component.scss'],
})
export class CouponsCreateComponent implements OnInit {
  form: FormGroup;
  edit = false;
  couponId;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cupon: PayuService,
    private parametros: ActivatedRoute
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
  }

  getCouponInfo(): void {
    const couponReceived = this.cupon.getCoupon(this.couponId)
      .valueChanges()
      .subscribe(c => {
        this.cuponField.setValue(c.cupon);
        this.porcentajeField.setValue(c.porcentaje);
        this.activoField.setValue(c.activo);
        couponReceived.unsubscribe();
      });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      id: [0],
      cupon: ['', Validators.required],
      porcentaje: [0, Validators.required],
      activo: [true],
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

  saveOrEditCoupon(event: Event): void {
    event.preventDefault();

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
}
