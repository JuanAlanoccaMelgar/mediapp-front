import { Paciente } from './paciente';

export class SignosVitales {
  idSignoVital: number;
  temperatura: string;
  pulso: string;
  ritmo: string;
  fecha: string;
  paciente: Paciente;
}
