import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { SignosVitales } from '../_model/signosVitales';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService extends GenericService<SignosVitales> {

  signoVitalCambio = new Subject<SignosVitales[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http : HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

}
