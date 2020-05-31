import { switchMap } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['paciente', 'temperatura', 'pulso', 'ritmo', 'acciones'];
  dataSource: MatTableDataSource<SignosVitales>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public route: ActivatedRoute,
    private signosVitalesService: SignosVitalesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.signosVitalesService.signoVitalCambio.subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });

    this.signosVitalesService.mensajeCambio.subscribe(data =>{
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.signosVitalesService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.transformarData(data);
      this.dataSource = new MatTableDataSource(data.content);
    })

  }

  eliminar(idSignoVital: number) {
    this.signosVitalesService.eliminar(idSignoVital).pipe(switchMap( ()=> {
      return this.signosVitalesService.listar();
    })).subscribe(data =>{
      this.signosVitalesService.signoVitalCambio.next(data);
      this.signosVitalesService.mensajeCambio.next('SE ELIMINO');
    });
  }

  filtrar(valor : string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  mostrarMas(e: any){
    this.signosVitalesService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  }

  transformarData(data: any){
    for(let dt of data.content){
      dt.nombres = dt.paciente.nombres;
      dt.apellidos = dt.paciente.apellidos;
    }
  }

}
