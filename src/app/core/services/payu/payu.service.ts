import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PayuService {

  constructor(public fireStore: AngularFirestore) { }

  createCoupon(data: any): Promise<void> {
    const id = this.fireStore.createId();
    const fecha = new Date();
    return this.fireStore.doc(`cupones/${id}`).set({
      id,
      cupon: data.cupon,
      porcentaje: data.porcentaje,
      activo: data.activo,
      tipo: data.tipo,
      curso: data.curso,
      fecha
    });
  }

  editCoupon(data: any, id: string): Promise<void> {
    return this.fireStore.doc(`cupones/${id}`)
      .update({
        cupon: data.cupon,
        porcentaje: data.porcentaje,
        activo: data.activo,
        tipo: data.tipo,
        curso: data.curso,
      });
  }

  getCoupon(id): AngularFirestoreDocument<any> {
    return this.fireStore.doc(`cupones/${id}`);
  }

  getCouponByCode(cupon: string): AngularFirestoreCollection {
    return this.fireStore.collection(`cupones`, (ref) =>
      ref.where('cupon', '==', cupon)
    );
  }

  deleteCoupon(id: string): Promise<void> {
    return this.fireStore.doc(`cupones/${id}`).delete();
  }

  listCoupons(): AngularFirestoreCollection {
    return this.fireStore.collection(`cupones`, (ref) =>
      ref.orderBy('cupon', 'asc')
    );
  }

  createPayment(data: any): Promise<void> {
    const id = this.fireStore.createId();
    const fecha = new Date();
    return this.fireStore.doc(`pagos/${id}`).set({
      id,
      idusuario: data.idusuario,
      usuario: data.usuario,
      usuarioCC: data.usuarioCC,
      referenceCode: data.referenceCode,
      signature: data.signature,
      totalCompra: data.totalCompra,
      totalAPagar: data.totalAPagar,
      descuento: data.descuento,
      course: data.course,
      courseId: data.courseId,
      estado: data.estado,
      tipo: data.tipo,
      moneda: data.moneda,
      fecha,
      correo: data.correo
    });
  }

  updatePayment(data: any, id: string): Promise<void> {
    return this.fireStore.doc(`pagos/${id}`)
    .update({
      estado: data.estado,
      fechaPago: data.fechaPago,
      metodoPago: data.metodoPago,
      moneda: data.moneda,
    });
  }

  approvePayment(id: string): Promise<void> {
    return this.fireStore.doc(`pagos/${id}`)
    .update({
      estado: 'Transacción aprobada',
    });
  }

  reversePayment(id: string): Promise<void> {
    return this.fireStore.doc(`pagos/${id}`)
    .update({
      estado: 'Transacción rechazada',
    });
  }

  deletePayment(id: string): Promise<void> {
    return this.fireStore.doc(`pagos/${id}`).delete();
  }

  getPaymentByRef(refCode: string): AngularFirestoreCollection {
    return this.fireStore.collection(`pagos`, (ref) =>
      ref.where('referenceCode', '==', refCode)
    );
  }

  getPaymentByUserId(userId: string): AngularFirestoreCollection {
    return this.fireStore.collection(`pagos`, (ref) =>
      ref.where('idusuario', '==', userId)
    );
  }

  listPayments(): AngularFirestoreCollection {
    return this.fireStore.collection(`pagos`);
  }
}
