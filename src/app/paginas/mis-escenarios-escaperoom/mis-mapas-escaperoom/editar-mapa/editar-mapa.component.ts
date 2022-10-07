import { EditarEscenaDialogComponent } from './../editar-escena-dialog/editar-escena-dialog.component';
import { ArchivosEscenas } from './../../../../URLs/urls';
import { AgregarEscenaDialogComponent } from './../agregar-escena-dialog/agregar-escena-dialog.component';
import { EscenaEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { EscenarioEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenarioEscaperoom';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog } from '@angular/material';
import { Coleccion, Cromo, Escenario } from 'src/app/clases';
import { DialogoConfirmacionComponent } from 'src/app/paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { AgregarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/agregar-cromo-dialog/agregar-cromo-dialog.component';
import { EditarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/editar-cromo-dialog/editar-cromo-dialog.component';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';

import 'rxjs';
import { Location } from '@angular/common';

import * as URL from '../../../../URLs/urls';

@Component({
  selector: 'app-editar-mapa',
  templateUrl: './editar-mapa.component.html',
  styleUrls: ['./editar-mapa.component.scss']
})
export class EditarMapaComponent implements OnInit {


  EscenaEscaperoom: EscenaEscaperoom;
  imagenesEscenas: string[] = [];
  archivosEscenas: string[] = [];

  nombreEscenario: string;
  descripcionEscenario: string;
  file: File;

  imagenCambiada: Boolean = false;


  cambios: Boolean = false;
  voltear: Boolean = false;
  mostrarTextoGuardar: Boolean = false;

  interval;
  EscenarioEscaperoom: EscenarioEscaperoom;
  EscenasdeEscenario: EscenaEscaperoom[];

  escenasAgregadas: EscenaEscaperoom[] = [];
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
    this.TraeArchivosEscenas();

  }

  EditarEscenario() {

    var escena= new EscenarioEscaperoom(this.EscenarioEscaperoom.profesorId, this.nombreEscenario, this.descripcionEscenario);
    escena.setPublica(this.EscenarioEscaperoom.Publica);
    this.peticionesAPI.ModificaEscenarioEscaperoom(escena, this.EscenarioEscaperoom.profesorId, this.EscenarioEscaperoom.id)
    .subscribe((res) => {
      if (res != null) {
        Swal.fire("Editado","Escenario editado con éxito",'success');
        this.EscenarioEscaperoom = res;

      } else {
      }
    });
    this.cambios = false;

  }

  AbrirDialogoAgregarEscenaEscenario(): void {
    const dialogRef = this.dialog.open(AgregarEscenaDialogComponent, {
      width: '900px',
      maxHeight: '600px',
      data: {
        escenario: this.EscenarioEscaperoom,
      }
    });

    dialogRef.afterClosed().subscribe(escenasAgregadas => {
      try{
      for (let i = 0 ; i < escenasAgregadas.length; i++) {
        this.EscenasdeEscenario.push (escenasAgregadas[i]);
      }
      this.TraeArchivosEscenas();
    }catch{}

     });
  }

  TraeArchivosEscenas() {
    for (let i = 0; i < this.EscenasdeEscenario.length; i++) {

      this.EscenaEscaperoom = this.EscenasdeEscenario[i];
      this.imagenesEscenas[i] = URL.ImagenesEscenas + this.EscenaEscaperoom.Tilesheet;
      
      this.archivosEscenas[i] = URL.ArchivosEscenas + this.EscenaEscaperoom.Archivo;

    }
    //por si quiero ordenar:
    //this.EscenasdeEscenario.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }

  AbrirDialogoEditarEscena(escena: EscenaEscaperoom): void {

    const dialogRef = this.dialog.open ( EditarEscenaDialogComponent , {
      width: '900px',
      maxHeight: '600px',
      data: {
        escena: escena,
        escenario: this.EscenarioEscaperoom,
      }
    });

    dialogRef.afterClosed().subscribe( escena => {
      try{
      if(escena!== null){
        this.EscenasdeEscenario.splice(this.EscenasdeEscenario.findIndex(escen=> escen.id==escena.id),1, escena);
        this.TraeArchivosEscenas();
      }
    }catch{}

    });
  }

 GuardarEscena(escena: EscenaEscaperoom) {
    this.sesion.TomaEscenaEscaperoom(this.EscenaEscaperoom);
  }

   AbrirDialogoConfirmacionBorrarEscena(escena: EscenaEscaperoom): void {
    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar la escena llamada: " +escena.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.BorrarEscena(escena);
        Swal.fire('Eliminado', 'Escena: ' + escena.Nombre + ' eliminada correctamente', 'success');

      };
    })

  }

   BorrarEscena(escena: EscenaEscaperoom) {
    const posicion = this.EscenasdeEscenario.indexOf (escena);

    this.peticionesAPI.BorrarEscenaEscaperoom (escena.id).subscribe( () => {
        this.EscenasdeEscenario.splice(posicion,1);

        this.peticionesAPI.BorrarImagenEscena(escena.Tilesheet).subscribe( () => {

          this.imagenesEscenas.splice(posicion,1);
          this.peticionesAPI.BorrarArchivoEscena(escena.Archivo).subscribe( () => {

            this.archivosEscenas.splice(posicion,1);
          }
          );        
        }
      );
      });
  }


  goBack() {
    if (this.cambios) {
      const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
        height: '150px',
        data: {
          mensaje: 'Dale a Aceptar si no quieres que se hagan los cambios en el nombre o en la descripcion del escenario'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }

}
