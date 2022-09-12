import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ObjetoEscaperoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { EditarEscenaDialogComponent } from '../../mis-escenarios-escaperoom/mis-mapas-escaperoom/editar-escena-dialog/editar-escena-dialog.component';
import 'rxjs';
import * as URL from '../../../URLs/urls';
@Component({
  selector: 'app-mostrar-objetos-publicos',
  templateUrl: './mostrar-objetos-publicos.component.html',
  styleUrls: ['./mostrar-objetos-publicos.component.scss']
})
export class MostrarObjetosPublicosComponent implements OnInit {
  ObjetoEscaperoom: ObjetoEscaperoom;
  ObjetoEscaperoomCambiado: ObjetoEscaperoom;

  nombreObjeto: string;
  tipoObjeto: string;
  imagenObjeto: string;
  imagenObjetoAntigua: string;


  // imagen y archivo escena
  nombreImagenObjetoAntigua: string;
  nombreImagenObjetoNueva: string;
  fileImagenObjeto: File;

  // tslint:disable-next-line:ban-types
  imagenObjetoCargada: Boolean = false;

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;
  profesorId: number;



  constructor(
              public dialog: MatDialog,
              // private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<MostrarObjetosPublicosComponent>,
              private http: Http,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.profesorId =this.sesion.DameProfesor().id;
    this.ObjetoEscaperoom = this.data.objeto;
    this.nombreObjeto = this.data.objeto.Nombre;
    this.nombreImagenObjetoNueva= this.data.objeto.Imagen;
    this.tipoObjeto = this.data.objeto.Tipo;
    console.log(this.ObjetoEscaperoom);
  }

Cerrar(): void {
  this.dialogRef.close();
}

}
