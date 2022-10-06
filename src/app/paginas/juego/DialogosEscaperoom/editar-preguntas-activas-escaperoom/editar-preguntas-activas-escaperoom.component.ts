import { forEach } from '@angular/router/src/utils/collection';
import { data } from 'jquery';
import { ObjetoActMostrar, ObjetoPreguntaActMostrar } from './../../juego.component';
import { ObjetoEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { EscenaActiva } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaActiva';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { Cromo, EscenaEscaperoom, EscenarioEscaperoom, Pregunta } from 'src/app/clases';
import { OpcionSeleccionada, EscenasActMostrar } from 'src/app/paginas/juego/juego.component';
import { AgregarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/agregar-cromo-dialog/agregar-cromo-dialog.component';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

import * as URL from '../../../../URLs/urls';

import 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoConfirmacionComponent } from 'src/app/paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { CellDef } from '@angular/cdk/table';
import { InformacionJuegoDeGeocachingDialogComponent } from 'src/app/paginas/juego-seleccionado-activo/juego-de-geocaching-seleccionado-activo/informacion-juego-de-geocaching-dialog/informacion-juego-de-geocaching-dialog.component';


@Component({
  selector: 'app-editar-preguntas-activas-escaperoom',
  templateUrl: './editar-preguntas-activas-escaperoom.component.html',
  styleUrls: ['./editar-preguntas-activas-escaperoom.component.scss'],
})
export class EditarPreguntasActivasEscaperoomComponent implements OnInit {
  tengoEscenaRequisitoPuntos: boolean;

  constructor(              
    
    public dialog: MatDialog,  
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditarPreguntasActivasEscaperoomComponent>,
    private peticionesAPI: PeticionesAPIService,                
    private sesion: SesionService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


    selection = new SelectionModel<Pregunta>(true, []);

    
    preguntasProfesor: Pregunta[]=[];
    tengoPreguntas: boolean;
    dataSourcePreguntas;
    displayedColumnsPreguntas:string[]=['Titulo', 'Tipo', 'Pregunta','Tematica', 'Iconos'];
    objetoPregunta: ObjetoPreguntaActMostrar;
    objetoPreguntaAgregado: ObjetoPreguntaActMostrar;
    preguntaSeleccionada: Pregunta;
    tengoPreguntaSeleccionada: boolean;

    tengoObjetoPregunta: boolean;
    PuntosSumar: number;
    PuntosSumarReserva: number;
    tengoPuntosSumar: boolean;
    PuntosRestar: number;
    PuntosRestarReserva: number;
    tengoPuntosRestar: boolean;
    tituloPreguntaSeleccionada: string;
    IdPreguntaSeleccionada:number;

    changed: boolean;

  ngOnInit() {
    this.tengoObjetoPregunta=false;
    this.changed=false;
    this.objetoPregunta=this.data.objeto;
    this.preguntasProfesor= this.data.preguntas;
    if (this.data.preguntas!=undefined){
      this.tengoPreguntas=true;
      this.dataSourcePreguntas= new MatTableDataSource(this.preguntasProfesor);
    }else{
      this.tengoPreguntas=false;
    }
    this.PuntosSumar=this.data.objeto.Sumar;
    this.PuntosSumarReserva=this.data.objeto.Sumar;
    this.PuntosRestar= this.data.objeto.Restar;
    this.PuntosRestarReserva=this.data.objeto.Restar;
    this.tengoPuntosSumar=false;
    this.tengoPuntosRestar=false;
    this.tengoPreguntaSeleccionada=false;
  }


  EditarPregunta(){    
    this.selection.clear();
    this.changed=true;
    this.tengoObjetoPregunta=false;
    if(!this.tengoPreguntaSeleccionada){
      this.objetoPreguntaAgregado= ({IdObjetoAct:this.objetoPregunta.IdObjetoAct,Nombre:this.objetoPregunta.Nombre, IdObjetoEscenaAct:this.objetoPregunta.IdObjetoEscenaAct, OrdenEscenaAct: this.objetoPregunta.OrdenEscenaAct, TengoPregunta: true, Sumar: this.PuntosSumar, Restar:this.PuntosRestar, IdPreguntaAct:this.objetoPregunta.IdPreguntaAct,TituloPregunta:this.objetoPregunta.TituloPregunta, Pregunta: this.objetoPregunta.Pregunta});
      console.log(this.objetoPreguntaAgregado);
      
    }else{
      this.objetoPreguntaAgregado= ({IdObjetoAct:this.objetoPregunta.IdObjetoAct,Nombre:this.objetoPregunta.Nombre, IdObjetoEscenaAct:this.objetoPregunta.IdObjetoEscenaAct, OrdenEscenaAct: this.objetoPregunta.OrdenEscenaAct, TengoPregunta: true, Sumar: this.PuntosSumar, Restar:this.PuntosRestar, IdPreguntaAct:this.preguntaSeleccionada.id,TituloPregunta:this.preguntaSeleccionada.Titulo, Pregunta:this.preguntaSeleccionada.Pregunta});
      console.log(this.objetoPreguntaAgregado);
    }
    Swal.fire("Escena añadida", "La escena se ha añadido con éxito", 'success');
  }

  SeleccionarPregunta(pregunta: Pregunta){
    var tabla=document.getElementById("tablaPA") as HTMLTableElement;
    let i = this.dataSourcePreguntas.filteredData.indexOf(pregunta);
    console.log(i,tabla);
    console.log(tabla.rows[i]);
    tabla.rows[i+1].classList.add("pregunta-seleccionada");
    var found=false;
    for(let b=1; b<tabla.rows.length && !found; b++){
      console.log(tabla.rows[b].className);
      if(b!=i+1){
        if(tabla.rows[b].className.endsWith("pregunta-seleccionada")){          
          tabla.rows[b].classList.remove("pregunta-seleccionada");
          found=true;
        }  
      }
    }
    this.preguntaSeleccionada=pregunta;
    this.tengoPreguntaSeleccionada=true;
    this.tengoObjetoPregunta=true;
  }

  TengoPuntosSumar(){
    if(!isNaN(+this.PuntosSumar)){      
      if(+this.PuntosSumar<=0){
        this.PuntosSumar=this.PuntosSumarReserva;
        this.tengoPuntosSumar=false;
        this.tengoObjetoPregunta=false;
        Swal.fire("Error", "No puede tener una posición superior al número de escenas totales o ser menor o igual a 0",'error');
      }else{     
        this.tengoObjetoPregunta=true;   
      }
    }else{
      this.tengoObjetoPregunta=false;      
      this.tengoPuntosSumar=false;
      this.PuntosSumar=this.PuntosSumarReserva;
    }
  }

  TengoPuntosRestar(){
    if(!isNaN(+this.PuntosRestar)){      
      if(+this.PuntosRestar<=0){
        this.PuntosRestar=this.PuntosRestarReserva;
        this.tengoPuntosRestar=false;
        this.tengoObjetoPregunta=false;
        Swal.fire("Error", "No puede tener una posición superior al número de escenas totales o ser menor o igual a 0",'error');
      }else{     
        this.tengoObjetoPregunta=true;   
      }
    }else{
      this.tengoObjetoPregunta=false;      
      this.tengoPuntosRestar=false;
      this.PuntosRestar=this.PuntosRestarReserva;
    }
  }


  Cerrar(): void {
    if (this.tengoObjetoPregunta) {
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
        this.dialogRef.close(this.objetoPreguntaAgregado);
      }else{
        this.dialogRef.close(null);
      }
    }
  }

  applyFilterPreguntas(filterValue: string){
    this.dataSourcePreguntas.filter = filterValue.trim().toLowerCase();
  }
}
