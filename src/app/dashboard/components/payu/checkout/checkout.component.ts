import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PayuService } from 'src/app/core/services/payu/payu.service';
import Swal from 'sweetalert2';
import { Payu, payuSignature } from '../../../../tools/config.js';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  user;
  courseToBuy;
  precio = {
      totalCompra: 0,
      descuento: 0,
      subtotal: 0,
      valorBase: 0,
      iva: 0,
      totalAPagar: 0,
      referenceCode: '',
      signature: '',
      merchantId: Payu.merchantId,
      accountId: Payu.accountId,
      test: Payu.test,
      responseUrl: Payu.responseUrl,
      confirmationUrl: Payu.confirmationUrl,
      action: Payu.action,
      moneda: '',
      urlFree: Payu.urlFree
  };

  moneda = 'COP';
  labelMoneda = 'USD';
  couponApplied = false;

  compra: string;

  @ViewChild('cupon') cupon: ElementRef;

  constructor(
    private payuService: PayuService,
    public dialog: MatDialogRef<CheckoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.data.user; // usuario logueado
    this.courseToBuy = this.data.course; // curso seleccionado
    this.precio.totalCompra = this.courseToBuy.precioCOP; // precio en COP por defecto
    this.compra = this.data.message; // curso o carrera?
    this.preparePayuForm(); // preparar valores curso
  }

  ngOnDestroy(): void {
    console.log('cierre modal checkout');
  }

  setPaymentInfo(): any {
    return {
      idusuario: this.user.id,
      usuario: `${this.user.nombres} ${this.user.apellidos}`,
      usuarioCC: this.user.identificacion,
      referenceCode: this.precio.referenceCode,
      signature: this.precio.signature,
      totalCompra: this.precio.totalCompra,
      totalAPagar: this.precio.totalAPagar,
      descuento: this.precio.descuento,
      course: this.courseToBuy.nombre,
      courseId: this.courseToBuy.id,
      estado: 'pendiente',
      tipo: this.compra,
      moneda: this.precio.moneda,
      correo: this.user.correo,
    };
  }

  preparePayuForm(): void {
    this.precio.totalAPagar = 0;

    this.precio.referenceCode = `${this.courseToBuy.nombre}-${Math.ceil(
      Math.random() * 1000000
    )}`;

    this.precio.iva = 0;

    this.precio.moneda = this.moneda;

    this.precio.valorBase = this.precio.iva > 0 ?
      this.precio.totalCompra - this.precio.descuento - this.precio.iva
      : 0;

    this.precio.totalAPagar = this.precio.totalCompra - this.precio.descuento;

    this.precio.signature = payuSignature.fnc(
      this.precio.referenceCode,
      this.precio.totalAPagar,
      this.moneda
    );

  }

  changeCurrency(): void {
    if (this.moneda === 'COP') {
      this.moneda = 'USD';
      this.labelMoneda = 'COP';
      this.precio.totalCompra = this.courseToBuy.precioUSD;
      this.checkCoupon();
    } else {
      this.moneda = 'COP';
      this.labelMoneda = 'USD';
      this.precio.totalCompra = this.courseToBuy.precioCOP;
      this.checkCoupon();
    }
  }

  checkCoupon(): void {
    const cuponReceived = this.cupon.nativeElement.value;
    if (cuponReceived) {
      this.getCoupon(cuponReceived);
    } else {
      this.precio.descuento = 0;
      this.couponApplied = false;
      this.preparePayuForm();
    }
  }

  getCoupon(cuponReceived): void {
    const getcoupon = this.payuService
        .getCouponByCode(cuponReceived)
        .valueChanges()
        .subscribe((coupons: any) => {
          let validation = false;
          let percentage;
          if (coupons.length > 0) {
            coupons.forEach(c => {
              if (c.curso === this.courseToBuy.id) {
                validation = true;
                percentage = c.porcentaje;
              }
            });
            if (validation) {
              this.precio.descuento =
              (this.precio.totalCompra * percentage) / 100;
              if (!this.couponApplied) {
                Swal.fire({
                  icon: 'success',
                  title: `Cupón de ${coupons[0].porcentaje}% aplicado.`,
                  text: '',
                  confirmButtonText: 'OK',
                });
                this.couponApplied = true;
              }
              this.preparePayuForm();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: '¡Cupón no valido para este programa de formación!',
                confirmButtonText: 'cerrar',
              });
              this.precio.descuento = 0;
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: '¡Cupón no valido!',
              confirmButtonText: 'cerrar',
            });
            this.precio.descuento = 0;
          }
          getcoupon.unsubscribe();
        });
  }

  onSubmit(event): void {
    const data = this.setPaymentInfo();
    if (data.usuarioCC) {
      this.payuService
        .createPayment(data)
        .then(() => {
          if (data.totalAPagar > 0) {
            event.target.submit();
          } else {
            const url = 
                `${this.precio.urlFree}?transactionState=4&referenceCode=${data.referenceCode}&polPaymentMethodType=cupon&currency=COP&buyerEmail=${this.user.correo}&processingDate=${new Date().toLocaleDateString()}&TX_VALUE=0`;
            this.router.navigateByUrl(url);
            this.dialog.close();
          }
        })
        .catch((err) => console.log(err));
    } else {
      Swal.fire('Error', 'No tenemos registrada su identificación, por favor complete sus datos en la opción editar perfil.', 'error');
    }
  }
}
