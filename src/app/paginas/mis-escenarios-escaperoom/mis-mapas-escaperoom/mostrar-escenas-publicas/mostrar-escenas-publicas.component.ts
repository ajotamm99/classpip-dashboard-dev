
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog } from '@angular/material';
import { EscenaEscaperoom, EscenarioEscaperoom } from 'src/app/clases';
import { DialogoConfirmacionComponent } from 'src/app/paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { AgregarEscenaDialogComponent } from '../agregar-escena-dialog/agregar-escena-dialog.component';
import { EditarEscenaDialogComponent } from '../editar-escena-dialog/editar-escena-dialog.component';
import { Location } from '@angular/common';

import 'rxjs';

import * as URL from '../../../../URLs/urls';
@Component({
  selector: 'app-mostrar-escenas-publicas',
  templateUrl: './mostrar-escenas-publicas.component.html',
  styleUrls: ['./mostrar-escenas-publicas.component.scss']
})
export class MostrarEscenasPublicasComponent implements OnInit {


  EscenaEscaperoom: EscenaEscaperoom;
  imagenesEscenas: string[] = [];
  archivosEscenas: string[] = [];

  nombreEscenario: string;
  descripcionEscenario: string;

  EscenarioEscaperoom: EscenarioEscaperoom;
  EscenasdeEscenario: EscenaEscaperoom[];

  constructor(
              public dialog: MatDialog,
              private location: Location,
              private http: Http,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService
  ) { }

  ngOnInit() {
    this.EscenarioEscaperoom = this.sesion.DameEscenarioEscaperoom();
    this.EscenasdeEscenario = this.sesion.DameEscenasdeEscenario();
    this.nombreEscenario = this.EscenarioEscaperoom.Nombre;
    this.descripcionEscenario = this.EscenarioEscaperoom.Descripcion;
    console.log ('escenas');
    console.log (this.EscenasdeEscenario);
    this.TraeArchivosEscenas();
  }


  TraeArchivosEscenas() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.EscenasdeEscenario.length; i++) {

      this.EscenaEscaperoom = this.EscenasdeEscenario[i];
      this.imagenesEscenas[i] = URL.ImagenesEscenas + this.EscenaEscaperoom.Tilesheet;
      this.archivosEscenas[i] = URL.ArchivosEscenas + this.EscenaEscaperoom.Archivo;

    }
    //por si quiero ordenar:
    //this.EscenasdeEscenario.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }



  goBack() {
    this.location.back();
  }

}
