import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '../model/Cliente';
import { ClienteService } from '../cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { ClienteEditComponent } from '../cliente-edit/cliente-edit.component';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {

  dataSource = new MatTableDataSource<Cliente>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private clienteService: ClienteService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(
      clientes => this.dataSource.data = clientes
    );
  }
  createCliente(){
    const dialogRef = this.dialog.open(ClienteEditComponent,{
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  editCliente(cliente: Cliente) {
    const dialogRef = this.dialog.open(ClienteEditComponent, {
      data: { cliente: cliente }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteCliente(cliente: Cliente){
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar cliente", description: "Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.deleteClientes(cliente.id).subscribe(result => {
          this.ngOnInit();
        }); 
      }
    });
  }

}
