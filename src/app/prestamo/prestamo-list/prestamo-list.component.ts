import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrestamoService } from '../prestamo.service';
import { Prestamo } from '../model/Prestamo';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { PrestamoEditComponent } from '../prestamo-edit/prestamo-edit.component';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { Game } from 'src/app/game/model/Game';
import { Cliente } from 'src/app/cliente/model/Cliente';
import { GameService } from 'src/app/game/game.service';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { Title } from '@angular/platform-browser';
import { ThisReceiver } from '@angular/compiler';
import * as moment from 'moment';


@Component({
  selector: 'app-prestamo-list',
  templateUrl: './prestamo-list.component.html',
  styleUrls: ['./prestamo-list.component.scss']
})
export class PrestamoListComponent implements OnInit {

  clientes: Cliente[];
  games: Game[];
  filterTitle: Game;
  filterCliente: Cliente;
  filterDate: Date;

  constructor(
    private gameService: GameService,
    private clienteService: ClienteService,
    private prestamoService: PrestamoService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadPage();
    this.gameService.getGames().subscribe(
      games => this.games = games
    );
    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes
    );

  }
  onCleanFilter():void{
    this.filterCliente = null;
    this.filterTitle = null;
    this.filterDate = null;
    
    this.ngOnInit();
  }
 
  onSearch():void{
    let title = this.filterTitle != null ? this.filterTitle.id : null;
    let clienteId = this.filterCliente != null ? this.filterCliente.id : null;
    let date = this.filterDate != null ? this.filterDate: null;

    this.loadPage(null,title,clienteId,date);
    
  }
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    dataSource = new MatTableDataSource<Prestamo>(); //DATASOURCE!
    displayedColumns: string[] = ['id', 'game', 'cliente','dateIni','dateFin', 'action'];

  
    loadPage(event?: PageEvent, filterTitle?: number, clienteId?: number , filterDate?: Date) {


        let pageable : Pageable =  {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [{
                property: 'id',
                direction: 'ASC'
            }]
        }

        if (event != null) {
            pageable.pageSize = event.pageSize
            pageable.pageNumber = event.pageIndex;
        }

        this.prestamoService.getPrestamos(pageable,filterTitle,clienteId,filterDate).subscribe(data => {
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        });

    }  

  createPrestamo() {    
     
        const dialogRef = this.dialog.open(PrestamoEditComponent, {
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.ngOnInit();
        });      
    }  

    deletePrestamo(prestamo: Prestamo) {    
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            data: { title: "Eliminar prestamo", description: "Atención si borra el prestamo se perderán sus datos.<br> ¿Desea eliminar el prestamo?" }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.prestamoService.deletePrestamo(prestamo.id).subscribe(result =>  {
                    this.ngOnInit();
                }); 
            }
        });
    } 
   
    //DAR FORMATO A LA FECHA mock dates!
    getFormattedDate(date: Date): String {
      
     let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
    
      return  day + '/' + month + '/' + year;
  
    }
    getStringDate(date: Date):void{
      if(date == null){
        console.log("FechaNula");
      }
      else{
        console.log(date);
      }
     
    }
    
}
