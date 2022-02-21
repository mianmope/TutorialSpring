import { Injectable } from '@angular/core';
import { CLIENTE_DATA } from './model/mock-clientes';
import { Cliente } from './model/Cliente';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private http: HttpClient
  ) { }

  getClientes(): Observable<Cliente[]> {
    
    return this.http.get<Cliente[]>('http://localhost:8080/cliente');
  }
  saveClientes(cliente: Cliente): Observable<Cliente> {
    
    let url = 'http://localhost:8080/cliente';
        if (cliente.id != null)
          url += '/'+cliente.id;
        return this.http.put<Cliente>(url, cliente);
  }

  deleteClientes(idCliente : number): Observable<any> {
    return this.http.delete('http://localhost:8080/cliente/'+idCliente);
  }  
}
