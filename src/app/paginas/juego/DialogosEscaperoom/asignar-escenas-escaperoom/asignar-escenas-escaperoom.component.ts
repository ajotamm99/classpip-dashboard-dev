import { EscenaActiva } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaActiva';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { Cromo, EscenaEscaperoom, EscenarioEscaperoom } from 'src/app/clases';
import { OpcionSeleccionada } from 'src/app/paginas/juego/juego.component';
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
  selector: 'app-asignar-escenas-escaperoom',
  templateUrl: './asignar-escenas-escaperoom.component.html',
  styleUrls: ['./asignar-escenas-escaperoom.component.scss']
})

export class AsignarEscenasEscaperoomComponent implements OnInit {

  constructor(              
    
    public dialog: MatDialog,  
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AsignarEscenasEscaperoomComponent>,
    private peticionesAPI: PeticionesAPIService,                
    private sesion: SesionService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    selection = new SelectionModel<EscenarioEscaperoom>(true, []);

    tipos: tipoRequisito[]=[
      {nombre: "Puntos", descripcion:"Selecciona este si quieres que se requieran puntos para superar la escena", id: "puntos"},
      {nombre: "Objeto", descripcion:"Selecciona este si quieres que se requieran objetos para superar la escena", id: "objeto"}
    ];
    

    escenasDeEscenario: EscenaEscaperoom[]=[];
    dataSourceEscenasDeEscenario;
    escenaAgregada: EscenaEscaperoom;
    imagenEscena: string;
    escenaActiva: EscenaActiva;
    TiempoLimiteEscena: string;
    TiempoLimite: number;
    tengoTiempoLimite: boolean;
    TipoRequisito: string;
    tipoPuntos:boolean;
    RequisitoPuntosEscena: string;
    RequisitoPuntos: number;
    tengoTipoPuntos: boolean;
    tengoRequisitoPuntos: boolean;

    numeroEscenas:number;
    ordenEscena: string;
    orden: number;
    tengoOrdenEscenas: boolean;

    tengoEscena: boolean;
    changed: boolean;

    
    displayedColumns: string[] = ['select', 'Nombre'];

  ngOnInit() {

    this.tengoEscena=false;
    this.changed=false;
    this.tengoTiempoLimite=false;
    this.escenasDeEscenario=this.data.escenas;
    this.numeroEscenas=this.data.numero;
    this.ordenEscena=this.data.numero+1;
    this.orden=this.data.numero+1;
    this.tengoRequisitoPuntos=false;
    this.tipoPuntos=false;
    this.tengoOrdenEscenas=false;
    this.TipoRequisito= this.tipos[0].id;    
    this.tengoRequisitoPuntos=false;
    this.tengoOrdenEscenas=true;
    this.tengoTipoPuntos=true;
    this.dataSourceEscenasDeEscenario= new MatTableDataSource(this.data.escenas);
  }


  Marcar(row) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.tengoEscena=false;
      this.escenaAgregada=undefined;
      this.imagenEscena=undefined;
      this.escenaActiva=undefined;
      this.changed=false;
    } else {
      this.selection.clear();
      this.selection.select(row);
      this.dataSourceEscenasDeEscenario.data.forEach ( row => {
        if (this.selection.isSelected(row)) {
          console.log ('hemos elegido ', row);
          this.escenaAgregada = row;
          this.imagenEscena= URL.ImagenesEscenas + this.escenaAgregada.Tilesheet;
          console.log(row);          
          this.tengoEscena=true;
        }
      });
    }
  }

  AsignarEscena(){
    if(this.TipoRequisito=='puntos' && this.tengoTiempoLimite && this.tengoRequisitoPuntos && this.tengoOrdenEscenas){
      this.selection.clear();
      this.changed=true;
      this.tengoEscena=false;
      this.escenaActiva= new EscenaActiva(this.escenaAgregada.escenarioEscapeRoomId, this.escenaAgregada.id, this.orden, this.TiempoLimite, this.TipoRequisito, this.RequisitoPuntos);
      console.log(this.escenaActiva);
      Swal.fire("Escena añadida", "La escena se ha añadido con éxito", 'success');
    }else if(this.TipoRequisito=='objeto' && this.tengoTiempoLimite && this.tengoOrdenEscenas){
      this.selection.clear();
      this.changed=true;
      this.tengoEscena=false;
      this.escenaActiva= new EscenaActiva(this.escenaAgregada.escenarioEscapeRoomId, this.escenaAgregada.id, this.orden, this.TiempoLimite, this.TipoRequisito);
      console.log(this.escenaActiva);
      Swal.fire("Escena añadida", "La escena se ha añadido con éxito", 'success');
    }else{
      Swal.fire("Error", "Completa todos los campos de la escena", 'error');
    }
    
  }

  TengoTiempoLimiteEscena(){
    console.log(this.tengoTiempoLimite);
    if(!isNaN(+this.TiempoLimiteEscena)){
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
      if(+this.ordenEscena>(this.numeroEscenas+1) || +this.ordenEscena<=0){
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
      this.tengoTipoPuntos=true;
    }else{
      this.tengoTipoPuntos=false;
    }
  }

  Cerrar(): void {
    if (this.tengoEscena) {
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
        this.dialogRef.close({Escena: this.escenaAgregada, EscenaAct: this.escenaActiva});
      }else{
        this.dialogRef.close(null);
      }
    }
  }

  applyFilterEscenas(filterValue:string){    
    this.dataSourceEscenasDeEscenario.filter = filterValue.trim().toLowerCase();
  }

}
