import { Injectable } from '@angular/core';
import { Pageable } from '../core/model/page/Pageable';
import { PrestamoPage } from './model/PrestamoPage';
import { Prestamo } from './model/Prestamo';
import { Observable, of } from 'rxjs';
import { PRESTAMO_DATA } from './model/mock-prestamo';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment-timezone';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';




@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  constructor(
    private http:HttpClient
  ) { }

  getPrestamos(pageable: Pageable, title?: number, clienteId?: number, filterDate?: Date): Observable<PrestamoPage> {
    return this.http.post<PrestamoPage>(this.composeFindUrl(title,clienteId,filterDate),{pageable:pageable});
     
  }

  savePrestamo(prestamo: Prestamo): Observable<void> {
     let url = 'http://localhost:8080/prestamo';
 
     return this.http.put<void>(url,prestamo);

  }

  deletePrestamo(idPrestamo : number): Observable<void> {
     return this.http.delete<void>('http://localhost:8080/prestamo/'+idPrestamo);
  } 

  private composeFindUrl(title?: number, clienteId?: number, filterDate?: Date) : string {
    let params = '';

    if (title != null) {
        params += 'title='+title;
    }

    if (clienteId != null) {
        if (params != '')
          params += "&";
        params += "idCliente="+clienteId;
    }
    if(filterDate != null){
      if (params != '')
          params += "&";
     
      let formatoFecha = moment(filterDate).format('YYYY/MM/DD');
      params += "filterDate="+formatoFecha;
      
    }

    let url = 'http://localhost:8080/prestamo'

    if (params == '') return url;
    else return url + '?'+params;
}   
  
  
}
