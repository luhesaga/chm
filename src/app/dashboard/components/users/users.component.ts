import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../../core/services/users/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserInfoComponent } from './user-info/user-info.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['apellidos', 'nombres', 'correo', 'eliminado', 'perfil', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  usuarios;
  usuariosBk;
  activos = false;
  inactivos = false;

  constructor(
    private userService: UsersService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getUSers();
  }

  ngOnDestroy(): void {
    if (this.usuarios) {
      this.usuarios.unsubscribe();
    }
  }

  getUSers(): void {
    this.usuarios = this.userService
      .listUsers()
      .valueChanges()
      .subscribe(users => {
        this.dataSource.data = users;
        this.usuariosBk = users.slice();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  check(event: Event): void {
    event.preventDefault();
  }

  becomeAdmin(id, admin): void {
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
          .then(() => {
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

  userInfo(data): void {
    //console.log(data);
    data.eliminado = data.eliminado ? true : false;
    const config = {
      data: {
        message: 'información del usuario',
        content: data
      }
    };

    const dialogRef = this.dialog.open(UserInfoComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result ${result}`);
    });
  }

  verSoloActivos(event): void {
    if (event.checked) {
      console.log('activo');
      this.activos = true;
      this.inactivos = false;
      this.dataSource.data = this.usuariosBk.filter(x => !x.eliminado);
    } else {
      console.log('chao');
      this.activos = false;
      this.dataSource.data = this.usuariosBk;
    }
  }

  verSoloInactivos(event): void {
    if (event.checked) {
      console.log('activo');
      this.inactivos = true;
      this.activos = false;
      this.dataSource.data = this.usuariosBk.filter(x => x.eliminado);
    } else {
      console.log('chao');
      this.inactivos = false;
      this.dataSource.data = this.usuariosBk;
    }
  }

}
