import { EscenaActiva } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaActiva';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { Cromo, EscenaEscaperoom, EscenarioEscaperoom } from 'src/app/clases';
import { EscenasActMostrar, OpcionSeleccionada } from 'src/app/paginas/juego/juego.component';
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
  selector: 'app-editar-escenas-activas-escaperoom',
  templateUrl: './editar-escenas-activas-escaperoom.component.html',
  styleUrls: ['./editar-escenas-activas-escaperoom.component.scss']
})
export class EditarEscenasActivasEscaperoomComponent implements OnInit {

  constructor(              
    
    public dialog: MatDialog,  
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditarEscenasActivasEscaperoomComponent>,
    private peticionesAPI: PeticionesAPIService,                
    private sesion: SesionService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    selection = new SelectionModel<EscenarioEscaperoom>(true, []);

    tipos: tipoRequisito[]=[
      {nombre: "Puntos", descripcion:"Selecciona este si quieres que se requieran puntos para superar la escena", id: "puntos"},
      {nombre: "Objeto", descripcion:"Selecciona este si quieres que se requieran objetos para superar la escena", id: "objeto"}
    ];
    
    idEscenaAct:string;

    escenaAgregada: EscenasActMostrar;
    imagenEscena: string;
    escenaNombre: string;
    escenaActiva: EscenaActiva;
    TiempoLimiteEscena: string;
    TiempoLimite: number;
    tengoTiempoLimite: boolean;
    TipoRequisito: string;
    RequisitoPuntosEscena: string;
    RequisitoPuntos: number;
    tengoTipoPuntos: boolean;
    tengoRequisitoPuntos: boolean;

    numeroEscenas:number;
    ordenEscena: string;
    orden: number;
    tengoOrdenEscenas: boolean;

    cambios: boolean;
    changed: boolean;

    

  ngOnInit() {

    this.idEscenaAct=this.data.escena.IdEscenaAct;

    this.imagenEscena=URL.ImagenesEscenas+this.data.imagen;
    this.escenaNombre= this.data.escena.Nombre;
    this.ordenEscena= (this.data.escena.Orden).toString();    
    this.orden=(this.data.escena.Orden);           
    this.tengoOrdenEscenas=true;

    this.numeroEscenas=this.data.numero;

    this.tengoTiempoLimite=true;
    this.TiempoLimiteEscena=this.data.escena.TiempoLimite;
    this.TiempoLimite= +this.data.escena.TiempoLimite;
    
    this.cambios=false;

    this.changed=false;

    this.TipoRequisito= this.data.escena.Requisito;
    if(this.data.escena.Requisito=="puntos"){
      this.tengoTipoPuntos=true;
      this.tengoRequisitoPuntos=true;
      this.RequisitoPuntos= +this.data.escena.Puntosrequisito;
      this.RequisitoPuntosEscena= this.data.escena.Puntosrequisito;
    }else{
      this.tengoTipoPuntos=false;
      this.tengoRequisitoPuntos=false;
    }

  }


  EditarEscena(){
    if(this.TipoRequisito=='puntos' && this.tengoTiempoLimite && this.tengoRequisitoPuntos && this.tengoOrdenEscenas){
      this.selection.clear();
      this.changed=true;
      this.cambios=false;
      this.escenaAgregada= ({Nombre:this.escenaNombre, IdEscenaAct:this.idEscenaAct, TiempoLimite:this.TiempoLimite, Orden:this.orden, Requisito:this.TipoRequisito, Puntosrequisito:this.RequisitoPuntosEscena});
      console.log(this.escenaActiva);
      Swal.fire("Escena añadida", "La escena se ha añadido con éxito", 'success');
    }else if(this.TipoRequisito=='objeto' && this.tengoTiempoLimite && this.tengoOrdenEscenas){
      this.selection.clear();
      this.changed=true;
      this.cambios=false;
      this.escenaAgregada= ({Nombre:this.escenaNombre, IdEscenaAct:this.idEscenaAct, TiempoLimite:this.TiempoLimite, Orden:this.orden, Requisito:this.TipoRequisito});
      console.log(this.escenaActiva);
      Swal.fire("Escena añadida", "La escena se ha añadido con éxito", 'success');
    }else{
      Swal.fire("Error", "Completa todos los campos de la escena", 'error');
    }
    
  }

  TengoTiempoLimiteEscena(){
    console.log(this.tengoTiempoLimite);
    if(!isNaN(+this.TiempoLimiteEscena)){
      this.cambios=true;
      this.tengoTiempoLimite=true;
      this.TiempoLimite= +this.TiempoLimiteEscena;
    }else{
      this.tengoTiempoLimite=false;
      this.TiempoLimite=undefined;
    }
  }

  TengoPuntosEscena(){
    console.log(this.tengoRequisitoPuntos);
    if(!isNaN(+this.RequisitoPuntosEscena)){
      this.cambios=true;
      this.tengoRequisitoPuntos=true;
      this.RequisitoPuntos= +this.RequisitoPuntosEscena;
    }else{
      this.tengoRequisitoPuntos=false;
      this.RequisitoPuntos=undefined;
    }
  }

  TengoOrdenEscena(){
    console.log(this.tengoOrdenEscenas);
    if(!isNaN(+this.ordenEscena)){      
      if(+this.ordenEscena>(this.numeroEscenas) || +this.ordenEscena<=0){
        this.cambios=true;
        this.tengoOrdenEscenas=false;
        this.orden=undefined;
        Swal.fire("Error", "No puede tener una posición superior al número de escenas totales o ser menor o igual a 0",'error');
      }else{        
        this.tengoOrdenEscenas=true;
        this.orden= +this.ordenEscena;
      }
    }else{
      this.tengoOrdenEscenas=false;
      this.orden=undefined;
    }
  }

  AsignarTipo(){
    console.log(this.TipoRequisito, this.tengoRequisitoPuntos);
    if(this.TipoRequisito=='puntos'){      
      this.cambios=true;
      this.tengoTipoPuntos=true;
    }else{
      this.tengoTipoPuntos=false;
    }
  }

  Cerrar(): void {
    if (this.cambios) {
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
        this.dialogRef.close(this.escenaAgregada);
      }else{
        this.dialogRef.close(null);
      }
    }
  }

}
