import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../../core/services/users/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombres', 'apellidos', 'correo', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService
      .listUsers()
      .valueChanges()
      .subscribe(users => (this.dataSource.data = users));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  check(event: Event) {
    event.preventDefault();
  }

  becomeAdmin(id, admin) {
    let message;
    if (admin) {
      message = 'El usuario perdera los privilegios de administrador.';
    } else {
      message = 'Convertira a este usuario en administrador.'
    }
    Swal.fire({
      title: '¿Esta seguro?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.becomeAdmin(id, !admin)
          .then(res => {
            Swal.fire(
              'Listo!',
              'Privilegios del usuario actualizados.',
              'success'
            );
          })
          .catch(error => console.log(error));
      }
    });
  }

}
