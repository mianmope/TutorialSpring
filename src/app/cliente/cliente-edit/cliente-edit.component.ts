import { Component, OnInit, Inject} from '@angular/core';
import { Cliente } from '../model/Cliente';
import { ClienteListComponent } from '../cliente-list/cliente-list.component';
import { ClienteService } from '../cliente.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.component.html',
  styleUrls: ['./cliente-edit.component.scss']
})
export class ClienteEditComponent implements OnInit {

 
  cliente : Cliente;

  constructor(
    public dialogRef: MatDialogRef<ClienteEditComponent>,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data:any //Para añadir al dialogo la info del Cliente a Modificar
  ) { }

  ngOnInit(): void {
    if(this.data.cliente != null){ //Si existe info añadirla al cliente
      this.cliente = Object.assign({},this.data.cliente); //Crear un nuevo objeto para no modificar la info de la lista
    }
    else{
      this.cliente = new Cliente();
    }
    
  }

  onSave() {
    this.clienteService.saveClientes(this.cliente).subscribe(result => {
      this.dialogRef.close();
    });    
  }  

  onClose() {
    this.dialogRef.close();
  }

}
