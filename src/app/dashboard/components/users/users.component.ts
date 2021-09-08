import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../../core/services/users/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UserEditComponent } from './user-edit/user-edit.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['apellidos', 'nombres', 'correo', 'perfil', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UsersService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getUSers();
  }

  getUSers() {
    let usuarios = this.userService
      .listUsers()
      .valueChanges()
      .subscribe(users => {
        this.dataSource.data = users;
        usuarios.unsubscribe();
      });
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

  openDialog(data): void {
    const config = {
      data: {
        message: data ? 'Editar usuario' : 'Agregar nuevo usuario',
        content: data
      }
    };

    const dialogRef = this.dialog.open(UserEditComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

}
