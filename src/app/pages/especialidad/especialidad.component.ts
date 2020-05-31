import { switchMap } from 'rxjs/operators';
import { EspecialidadService } from './../../_service/especialidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Especialidad } from './../../_model/especialidad';
import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {
  
  displayedColumns = ['id', 'nombre', 'acciones'];
  dataSource: MatTableDataSource<Especialidad>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private especialidadService: EspecialidadService, 
    private snackBar: MatSnackBar, 
    public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.especialidadService.especialidadCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.especialidadService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });

    this.especialidadService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    /*let array = [];
    for(let i = 0; i<3; i++){
      let obs = this.especialidadService.listar();
      array.push(obs);
    }

    forkJoin(array).subscribe(data => {
      console.log(data);
    });

    let obs1 = this.especialidadService.listar();
    let obs2 = this.especialidadService.listar();
    let obs3 = this.especialidadService.listar();

    forkJoin(obs1, obs2, obs3).subscribe(data => {
      console.log(data);
    });*/
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(especialidad: Especialidad) {
    this.especialidadService.eliminar(especialidad.idEspecialidad).pipe(switchMap(() => {
      return this.especialidadService.listar();
    })).subscribe(data => {
      this.especialidadService.especialidadCambio.next(data);
      this.especialidadService.mensajeCambio.next('Se eliminó');
    });
  }
}
