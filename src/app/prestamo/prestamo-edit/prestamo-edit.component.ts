import { Component, OnInit } from '@angular/core';
import { Prestamo } from '../model/Prestamo';
import { MatDialogRef } from '@angular/material/dialog';
import { PrestamoService } from '../prestamo.service';
import { Cliente } from 'src/app/cliente/model/Cliente';
import { ClienteService } from 'src/app/cliente/cliente.service';
import { Game } from 'src/app/game/model/Game';
import { GameService } from 'src/app/game/game.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { ThisReceiver } from '@angular/compiler';
import { elementAt } from 'rxjs';



@Component({
  selector: 'app-prestamo-edit',
  templateUrl: './prestamo-edit.component.html',
  styleUrls: ['./prestamo-edit.component.scss']
})
export class PrestamoEditComponent implements OnInit {

  cliente: Cliente;
  prestamo: Prestamo;
  clientes: Cliente[];
  games: Game[];
  
  constructor(
      public dialogRef: MatDialogRef<PrestamoEditComponent>,
      private prestamoService: PrestamoService,
      private clienteService: ClienteService,
      private gameService: GameService,
     
  ) { }

  ngOnInit(): void {
  
    this.loadPage();
  
    this.prestamo = new Prestamo();

    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes);
    
    this.gameService.getGames().subscribe(
      games => this.games = games);
  
  }
  
  onSave() {

      if(this.comprobarFecha(this.prestamo)){
        console.log("Fecha menor de 14 dias");
        if(this.comprobarDatosPrestamo()){
          console.log("realizar prestamo");
          //Guardamos en Back
          this.prestamoService.savePrestamo(this.prestamo).subscribe(result =>  {
            this.dialogRef.close();
          }); 
        }
        else{
          console.log("NOOO realizar prestamo");
          this.prestamo.dateIni = null;
          this.prestamo.dateFin = null;
          this.prestamo.cliente = null;
          this.prestamo.game = null;
        }
       
      }
      else{
        //Para mostrar mensaje error formulario!
        this.prestamo.dateIni = null;
        this.prestamo.dateFin = null;
      }
      
  }  

  onClose() {
      this.dialogRef.close();
  }
  comprobarFecha(prestamo: Prestamo): Boolean{
    
    let dateIni = new Date(prestamo.dateIni).getTime(); //Ms
    let dateFin = new Date(prestamo.dateFin).getTime();
    console.log(" Comprobar Fecha FechaInicio: " + dateIni+ "  FechaFin: " + dateFin);
    let resta = (dateFin- dateIni)/(1000*60*60*24); //Diferencia en dias
   
    if(dateFin > dateIni){
      if(resta <= 14){
        //console.log("Rango correcto");
        return true;
      }
      else{
        //console.log("Mas de 14 dias");
        return false;
      }
    }
    else{
      //console.log("Fecha Fin menor que fecha Ini");
      return false;
    }
    
   return true;
    
  }
  //Obtener informacion Prestamos Back!
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    dataSource = new MatTableDataSource<Prestamo>(); //DATASOURCE!

    loadPage(event?: PageEvent) {

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

        this.prestamoService.getPrestamos(pageable).subscribe(data => {
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        });

    }  
  
  /*
  return true si el cliente puede pedir el prestamo del juego
  */
  comprobarDatosPrestamo():Boolean{
    console.log("Entrooo!");
    this.loadPage();
    let permitido = false;
    
    if(!this.exitePrestamoJuego()){
      console.log("No existe prestamo del juego");
      if(this.clienteTieneJuegoPrestado()){
        console.log("Ya tenias Juego Prestado ANALIZAR FECHAS para ver si es compatible");
        if(this.fechaPrestamoPermitida(0)){
          console.log("Fechas Permitidas, PRESTAMO ACEPTADO");
          permitido = true;
        }
        else{
          console.log("Fechas NO , PRESTAMO DENEGADO!");
        }
      }
      else{//No esta prestado el juego y el cliente no tiene ningun otro
        console.log("Cliente no tiene juego prestado y el juego no esta prestado. Pues prestamo ACEPTADO");
        permitido = true;
      }
    }
    else{
      
      console.log("Juego ya está prestado analizar compatibilidad fechas y clientes");
      if(this.clienteTieneJuegoPrestado()){
        console.log("Cliente tiene juego prestado, analizar fechas");
        if(this.fechaPrestamoPermitida(0)){
          if(this.fechaPrestamoPermitida(1)){
            permitido = true;
          }
        }
      }
      else{
        console.log("Cliente no tiene juego prestado. Analizar fechas prestamo")
        if(this.fechaPrestamoPermitida(1)){
          console.log("fechas prestamo correctas. Prestamo ACEPTADO");
          permitido = true;
        }
        else{
          console.log("fechas prestamo incorrectas. Prestamo DENEGADO");
        }
      }

    }
    return permitido;
  }
  exitePrestamoJuego(): Boolean{
    let existe = false;
    let gameId = this.prestamo.game.id;
   
    console.log("PRESTAMOS:");
    console.log(this.dataSource.data);
  
    this.dataSource.data.forEach(element =>{
      if(element.game.id == gameId){
        existe = true;
      }
    });
    return existe;
  }
  clienteTieneJuegoPrestado(): Boolean{
    let existe = false;
    let clienteId = this.prestamo.cliente.id;

    this.dataSource.data.forEach(element =>{
      if(element.cliente.id == clienteId){
        existe = true;
      }
    });
    return existe;
  }
  fechaPrestamoPermitida(num: Number):Boolean{
   
    this.loadPage();
    let permitido = false;
    let dateIni = this.prestamo.dateIni;
    let dateFin = this.prestamo.dateFin;
    console.log("FechaPrestamoPermitida FechaInicio: " + dateIni+ "  FechaFin: " + dateFin);

    if(num == 0){ //Comprobar fecha con otro prestamo del idCliente
      let clienteId = this.prestamo.cliente.id;
      console.log("Comprobar fecha con otro prestamo del idCliente");
      let ini = this.dataSource.data.find(element => element.cliente.id == clienteId).dateIni;
      let fin = this.dataSource.data.find(element => element.cliente.id == clienteId).dateFin;
      console.log("FechaInicial pruebas:::" + ini);
      console.log("FechaFinal pruebas:::" + fin);
      if((ini == null && fin == null)){
        console.log("No existe otros prestamos del cliente por lo que Fecha Aceptada");
        permitido = true;
      }
      else if((ini > dateFin) || (fin < dateIni)){
        console.log("Fechas Compatibles");
        permitido = true;
      }
      else{
        console.log("Fecha denegada!!!");
      }
     
    }
    else{ //Comprobar fecha con prestamo del mismo juego
      let gameId = this.prestamo.game.id;

      let ini = this.dataSource.data.find(element => element.game.id == gameId).dateIni;
  
      let fin = this.dataSource.data.find(element => element.game.id == gameId).dateFin;
      if((ini == null && fin == null)){
        console.log("El juego no está prestado por lo que está permitido la fecha");
        permitido = true;
      }
      else if( (ini > dateFin) || (fin < dateIni))
      {
        console.log("Rango de fechas aceptada!");
        permitido = true;
      }
      else{
        console.log("Fecha denegada!!");
      }

    }

    return permitido;
  
  }
  
  

}
