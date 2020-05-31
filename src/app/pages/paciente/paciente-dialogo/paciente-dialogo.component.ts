import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PacienteService } from 'src/app/_service/paciente.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Paciente } from 'src/app/_model/paciente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  form: FormGroup;

  paciente: Paciente = new Paciente();

  constructor(
    public dialogRef: MatDialogRef<PacienteDialogoComponent>,
    private router: Router,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombres' : new FormControl(''),
      'apellidos' : new FormControl(''),
      'dni' : new FormControl(''),
      'telefono' : new FormControl(''),
      'direccion' : new FormControl(''),
    })
  }

  operar(){
    this.paciente.idPaciente = this.form.value['id'];
    this.paciente.nombres = this.form.value['nombres'];
    this.paciente.direccion = this.form.value['direccion'];
    this.paciente.apellidos = this.form.value['apellidos'];
    this.paciente.dni = this.form.value['dni'];
    this.paciente.telefono = this.form.value['telefono'];

    this.pacienteService.registrar(this.paciente).subscribe( data => {
      this.dialogRef.close(data);
    }, error => {

    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
