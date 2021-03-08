import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private af: AngularFireAuth
  ) { }

  loginUser( email: string, password: string): Promise<any> {
    return this.af.signInWithEmailAndPassword(email, password);
  }

  registerUser(email: string, password: string): Promise<any> {
    return this.af.createUserWithEmailAndPassword(email, password);
  }

  logout(): void {
    this.af.signOut();
  }
}
