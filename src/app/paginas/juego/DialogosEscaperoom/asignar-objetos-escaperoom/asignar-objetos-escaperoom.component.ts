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
import { Location } from '@angular/common';

import * as URL from '../../../../URLs/urls';

import 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoConfirmacionComponent } from 'src/app/paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';



@Component({
  selector: 'app-asignar-objetos-escaperoom',
  templateUrl: './asignar-objetos-escaperoom.component.html',
  styleUrls: ['./asignar-objetos-escaperoom.component.scss']
})
export class AsignarObjetosEscaperoomComponent implements OnInit {
  tengoEscenaRequisitoPuntos: boolean;

  constructor(              
    
    public dialog: MatDialog,  
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AsignarObjetosEscaperoomComponent>,
    private peticionesAPI: PeticionesAPIService,                
    private sesion: SesionService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    opciones = this.formBuilder.group({
      Pista: true,
      Pregunta: false,
      Movil: false,
      Requisito: false,
    });

    selection = new SelectionModel<ObjetoEscaperoom>(true, []);    

    objetosMostrar: ObjetoEscaperoom[]=[];
    escenaDelObjeto: EscenasActMostrar;
    objetoMostrar: ObjetoEscaperoom;
    objetoAgregado: ObjetoActMostrar;
    dataSourceObjetos;
    imagenObjeto: string;

    tengoObjetosDeEscena: boolean;
    tengoObjeto: boolean;
    tengoPista:boolean;
    pistaString: string;
    tengoPregunta: boolean;
    tengoRequisito: boolean;
    tengoMovil:boolean;
    lugarObjeto:string;

    changed: boolean;

    profesorId:number;

    
    displayedColumns: string[] = ['select', 'Nombre'];

  ngOnInit() {

    this.tengoObjeto=false;
    this.changed=false;
    this.escenaDelObjeto=this.data.escena;
    if(this.data.escena.Requisito=='puntos'){
      this.tengoEscenaRequisitoPuntos=true;
    }else if(this.data.escena.Requisito=='objeto'){
      this.tengoEscenaRequisitoPuntos=false;
    }
    this.tengoMovil=false;
    this.tengoPista=false;
    this.tengoPregunta=false;
    this.tengoRequisito=false;
    this.objetosMostrar=this.data.objetos;
    if (this.data.objetos!=null && this.data.objetos!=undefined){
      this.tengoObjetosDeEscena=true;
      this.dataSourceObjetos=new MatTableDataSource(this.objetosMostrar);
    }

  }


  Marcar(row) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.tengoObjeto=false;
      this.objetoMostrar=undefined;
      this.imagenObjeto=undefined;
      //this.escenaActiva=undefined;
      this.changed=false;
    } else {
      this.selection.clear();
      this.selection.select(row);
      this.dataSourceObjetos.data.forEach ( row => {
        if (this.selection.isSelected(row)) {
          this.objetoMostrar= row;
          this.imagenObjeto= URL.ImagenesObjetos + this.objetoMostrar.Imagen;
          this.tengoObjeto=true;
        }
      });
    }
  }

  AsignarObjeto(){
    if(this.tengoPista){
      if(this.pistaString!=null && this.pistaString!=''){
        this.selection.clear();
        this.changed=true;
        this.tengoObjeto=false;
        this.objetoAgregado= ({IdObjetoAct:this.objetoMostrar.id , Nombre:this.objetoMostrar.Nombre, IdObjetoEscenaAct:this.escenaDelObjeto.IdEscenaAct, OrdenEscenaAct: this.escenaDelObjeto.Orden, Pregunta:this.tengoPregunta, Pista: this.tengoPista, Movil:this.tengoMovil, PistaString:this.pistaString, EsRequisito: this.tengoRequisito});
        Swal.fire("Escena añadida", "La escena se ha añadido con éxito", 'success');
      }else{
        Swal.fire("Error", "No has insertado ninguna pista", 'error');
      }

    }else{
      this.selection.clear();
      this.changed=true;
      this.tengoObjeto=false;
      this.objetoAgregado= ({IdObjetoAct:this.objetoMostrar.id, Nombre:this.objetoMostrar.Nombre, IdObjetoEscenaAct:this.escenaDelObjeto.IdEscenaAct, OrdenEscenaAct: this.escenaDelObjeto.Orden, Pregunta:this.tengoPregunta, Pista: this.tengoPista, Movil:this.tengoMovil, EsRequisito: this.tengoRequisito});
      Swal.fire("Escena añadida", "La escena se ha añadido con éxito", 'success');
    }

    
  }

  TengoRequisito(){
    if(this.tengoRequisito){
      this.tengoMovil=true;
    }else{
      this.tengoMovil=false;
    }
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
