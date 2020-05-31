import { switchMap, map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { Paciente } from 'src/app/_model/paciente';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { PacienteService } from 'src/app/_service/paciente.service';
import { MatDialog } from '@angular/material/dialog';
import { PacienteEdicionComponent } from '../../paciente/paciente-edicion/paciente-edicion.component';
import { PacienteDialogoComponent } from '../../paciente/paciente-dialogo/paciente-dialogo.component';

@Component({
  selector: 'app-signos-vitales-edicion',
  templateUrl: './signos-vitales-edicion.component.html',
  styleUrls: ['./signos-vitales-edicion.component.css']
})
export class SignosVitalesEdicionComponent implements OnInit {

  form: FormGroup;
  paciente: Paciente;
  pacienteNombre: string;
  fecha: Date = new Date();
  fechaSeleccionada: string;

  maxFecha: Date = new Date();

  id: number;
  edicion: boolean;


  pacientes: Paciente[] = [];

  pacientesFiltrados: Observable<any[]>;
  myControlPaciente: FormControl = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private pacienteService: PacienteService,
    private signosVitalesService: SignosVitalesService
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      idSigno: new FormControl(0),
      paciente: this.myControlPaciente,
      temperatura: new FormControl(''),
      pulso: new FormControl(''),
      ritmo: new FormControl(''),
    });

    this.route.params.subscribe( (params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.cargarInformacion();
    });

    this.listarPacientes();
    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

  }

  cargarInformacion() {
    if (this.edicion) {
      this.signosVitalesService.listarPorId(this.id).subscribe( data => {
        this.paciente = data.paciente;
        this.fecha = new Date(data.fecha);
        this.form.controls['paciente'].setValue(this.paciente);
        this.pacienteNombre = `${this.paciente.nombres} ${this.paciente.apellidos}`;
        this.form = new FormGroup({
          idSigno: new FormControl(data.idSignoVital),
          temperatura: new FormControl(data.temperatura),
          pulso: new FormControl(data.pulso),
          ritmo: new FormControl(data.ritmo),
        });
      });
    }
  }

  nuevoPaciente(){

  }

  enviar() {

    let tzoffset = (this.fecha).getTimezoneOffset() * 60000;
    this.fechaSeleccionada = (new Date(Date.parse(this.fecha.toString()) - tzoffset)).toISOString();

    let signosVitales = new SignosVitales();
    signosVitales.idSignoVital = this.form.value['idSigno'];
    signosVitales.fecha = this.fechaSeleccionada;
    signosVitales.temperatura = this.form.value['temperatura'];
    signosVitales.pulso = this.form.value['pulso'];
    signosVitales.ritmo = this.form.value['ritmo'];
    signosVitales.paciente = this.paciente;

    if (this.edicion) {
      this.signosVitalesService.modificar(signosVitales).pipe(switchMap( ()=> {
        return this.signosVitalesService.listar();
      })).subscribe( data => {
        this.signosVitalesService.signoVitalCambio.next(data);
        this.signosVitalesService.mensajeCambio.next('SE MODIFICO');
      });
    } else {
      this.signosVitalesService.registrar(signosVitales).pipe(switchMap( ()=> {
        return this.signosVitalesService.listar();
      })).subscribe( data => {
        this.signosVitalesService.signoVitalCambio.next(data);
        this.signosVitalesService.mensajeCambio.next('SE REGISTRO');
      });
    }
    this.router.navigate(['signos']);

  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  mostrarPaciente(val : Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  filtrarPacientes(val : any){
    if(val != null && val.idPaciente > 0){
      return this.pacientes.filter(x =>
        x.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || x.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || x.dni.includes(val.dni)
      );
    }else{
      //string
      return this.pacientes.filter(x =>
        x.nombres.toLowerCase().includes(val.toLowerCase()) || x.apellidos.toLowerCase().includes(val.toLowerCase()) || x.dni.includes(val)
      );
    }
  }

  seleccionarPaciente(e : any){
    this.paciente = e.option.value;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PacienteDialogoComponent, {
      width: '450px',
      height: '320px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.form.controls['paciente'].setValue(result);
      this.paciente = result;
      this.pacienteNombre = `${result.nombres} ${result.apellidos}`;
    });
  }

}
