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
  selector: 'app-editar-objetos-activos-escaperoom',
  templateUrl: './editar-objetos-activos-escaperoom.component.html',
  styleUrls: ['./editar-objetos-activos-escaperoom.component.scss']
})
export class EditarObjetosActivosEscaperoomComponent implements OnInit {

  constructor(              
    
    public dialog: MatDialog,  
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditarObjetosActivosEscaperoomComponent>,
    private peticionesAPI: PeticionesAPIService,                
    private sesion: SesionService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


    selection = new SelectionModel<ObjetoEscaperoom>(true, []);

    

    objetosMostrar: ObjetoEscaperoom[]=[];
    objetosPublicos: ObjetoEscaperoom[]=[];
    objetoEditar: ObjetoActMostrar;
    nombreObjeto: string;
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
    idObjeto:number;

    changed: boolean;

  ngOnInit() {

    this.tengoObjeto=false;
    this.changed=false;
    this.escenaDelObjeto=this.data.escena;
    this.nombreObjeto=this.data.escena.Nombre;
    this.objetoEditar=this.data.objeto;
    this.tengoMovil=this.data.objeto.Movil;
    this.tengoPista=this.data.objeto.Pista;
    this.idObjeto=this.data.objeto.IdObjetoAct;
    this.tengoPregunta=this.data.objeto.Pregunta;
    if(this.data.objeto.Pista){
      this.pistaString=this.data.objeto.PistaString;
    }
    this.tengoRequisito=false;
    this.imagenObjeto= URL.ImagenesObjetos + this.data.imagen;

  }


  AsignarObjeto(){
    if(this.tengoPista){
      if(this.pistaString!=null && this.pistaString!=''){
        this.selection.clear();
        this.changed=true;
        this.tengoObjeto=false;
        this.objetoAgregado= ({IdObjetoAct:this.idObjeto, Nombre:this.nombreObjeto, IdObjetoEscenaAct:this.escenaDelObjeto.IdEscenaAct, OrdenEscenaAct: this.escenaDelObjeto.Orden, Pregunta:this.tengoPregunta, Pista: this.tengoPista, Movil:this.tengoMovil, PistaString:this.pistaString, EsRequisito: this.tengoRequisito});
        console.log(this.objetoAgregado);
        Swal.fire("Escena añadida", "La escena se ha añadido con éxito", 'success');
      }else{
        Swal.fire("Error", "No has insertado ninguna pista", 'error');
      }

    }else{
      this.selection.clear();
      this.changed=true;
      this.tengoObjeto=false;
      this.objetoAgregado= ({IdObjetoAct:this.idObjeto,Nombre:this.nombreObjeto, IdObjetoEscenaAct:this.escenaDelObjeto.IdEscenaAct, OrdenEscenaAct: this.escenaDelObjeto.Orden, Pregunta:this.tengoPregunta, Pista: this.tengoPista, Movil:this.tengoMovil, EsRequisito: this.tengoRequisito});
      console.log(this.objetoAgregado);
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
