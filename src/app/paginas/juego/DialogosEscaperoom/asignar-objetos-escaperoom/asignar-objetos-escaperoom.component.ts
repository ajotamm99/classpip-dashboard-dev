import { ObjetoActMostrar } from './../../juego.component';
import { ObjetoEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { EscenaActiva } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaActiva';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { Cromo, EscenaEscaperoom, EscenarioEscaperoom } from 'src/app/clases';
import { OpcionSeleccionada, EscenasActMostrar } from 'src/app/paginas/juego/juego.component';
import { AgregarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/agregar-cromo-dialog/agregar-cromo-dialog.component';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import Swal from 'sweetalert2';

import * as URL from '../../../../URLs/urls';

import 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoConfirmacionComponent } from 'src/app/paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';

export interface tipoRequisito {
  nombre: string,
  descripcion: string,
  id: string
}

@Component({
  selector: 'app-asignar-objetos-escaperoom',
  templateUrl: './asignar-objetos-escaperoom.component.html',
  styleUrls: ['./asignar-objetos-escaperoom.component.scss']
})
export class AsignarObjetosEscaperoomComponent implements OnInit {

  constructor(              
    
    public dialog: MatDialog,  
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AsignarObjetosEscaperoomComponent>,
    private peticionesAPI: PeticionesAPIService,                
    private sesion: SesionService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    selection = new SelectionModel<ObjetoEscaperoom>(true, []);

    tipos: tipoRequisito[]=[
      {nombre: "Puntos", descripcion:"Selecciona este si quieres que se requieran puntos para superar la escena", id: "puntos"},
      {nombre: "Objeto", descripcion:"Selecciona este si quieres que se requieran objetos para superar la escena", id: "objeto"}
    ];
    

    objetosMostrar: ObjetoEscaperoom[]=[];
    escenaDelObjeto: EscenasActMostrar;
    objetoMostrar: ObjetoEscaperoom;
    objetoAgregado: ObjetoActMostrar;
    dataSourceObjetos;
    imagenObjeto: string;


    tengoObjeto: boolean;
    changed: boolean;

    
    displayedColumns: string[] = ['select', 'Nombre'];

  ngOnInit() {

    this.tengoObjeto=false;
    this.changed=false;
    this.escenaDelObjeto=this.data.escena;

  }


  Marcar(row) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.tengoObjeto=false;
      this.objetoAgregado=undefined;
      this.imagenObjeto=undefined;
      //this.escenaActiva=undefined;
      this.changed=false;
    } else {
      this.selection.clear();
      this.selection.select(row);
      this.dataSourceObjetos.data.forEach ( row => {
        if (this.selection.isSelected(row)) {
          console.log ('hemos elegido ', row);
          this.objetoMostrar= row;
          this.imagenObjeto= URL.ImagenesObjetos + this.objetoMostrar.Imagen;
          console.log(row);          
          this.tengoObjeto=true;
        }
      });
    }
  }

  AsignarEscena(){

    
  }

  TengoPistaObjeto(){

  }

  TengoPreguntaObjeto(){

  }

  TengoMovilObjeto(){

  }

  EsRequisito(){

  }

  Cerrar(): void {
    if (this.tengoObjeto) {
      const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
        height: '150px',
        data: {
          mensaje: 'Dale a Aceptar si NO quieres que se hagan los cambios'
        }
      });
  
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dialogRef.close(null);
        }
      });
    } else {
      if(this.changed){
        this.dialogRef.close(this.objetoAgregado);
      }else{
        this.dialogRef.close(null);
      }
    }
  }

  applyFilterObjetos(filterValue:string){    
    this.dataSourceObjetos.filter = filterValue.trim().toLowerCase();
  }

}
