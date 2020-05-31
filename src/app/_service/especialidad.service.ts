import { GenericService } from './generic.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Especialidad } from './../_model/especialidad';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService extends GenericService<Especialidad>{

  especialidadCambio = new Subject<Especialidad[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http : HttpClient) { 
    super(
      http, 
      `${environment.HOST}/especialidades`);
  }
}
