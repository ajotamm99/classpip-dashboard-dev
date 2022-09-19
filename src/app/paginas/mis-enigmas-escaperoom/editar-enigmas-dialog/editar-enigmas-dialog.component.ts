import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'rxjs';
import { Enigma, ObjetoEscaperoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { EditarEscenaDialogComponent } from '../../mis-escenarios-escaperoom/mis-mapas-escaperoom/editar-escena-dialog/editar-escena-dialog.component';


interface Types{
  nombre: string;
  id: string
}
interface Dificultades{
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-editar-enigmas-dialog',
  templateUrl: './editar-enigmas-dialog.component.html',
  styleUrls: ['./editar-enigmas-dialog.component.scss']
})
export class EditarEnigmasDialogComponent implements OnInit {
  enigmaEscaperoom: Enigma;
  ObjetoEscaperoomCambiado: ObjetoEscaperoom;

  nombreEnigma: string;
  tipoEnigma: string;
  dificultadEnigma: string;

  selectedDificultad: string;
  selectedType: string;

  types: Types[]=[
    {nombre:'Llave', id:'llave'},
    {nombre:'Mapa', id: 'mapa'},
    {nombre:'Puzzle', id: 'puzzle'}
  ]
  
    dificultades: Dificultades[]=[
    {nombre:'Baja', id:'baja'},
    {nombre:'Media', id: 'media'},
    {nombre:'Alta', id: 'Alta'}
  ]

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;
  changed: Boolean = false;
  profesorId: number;



  constructor(
              public dialog: MatDialog,
              // private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditarEnigmasDialogComponent>,
              private http: Http,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.profesorId =this.sesion.DameProfesor().id;
    this.enigmaEscaperoom = this.data.enigma;
    this.nombreEnigma = this.data.enigma.Nombre;
    this.tipoEnigma= this.data.enigma.Tipo;
    this.dificultadEnigma = this.data.enigma.Dificultad;
    this.selectedDificultad= this.dificultadEnigma;
    this.selectedType= this.tipoEnigma;
  }

  EditarEnigma() {
    console.log('Entro a editar');
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaEnigma(new Enigma(this.tipoEnigma,  this.nombreEnigma, this.dificultadEnigma), this.enigmaEscaperoom.id,this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        this.enigmaEscaperoom = res;
        // this.cromosEditados.push (res);
        // console.log('nombre del cromo + nivel' + this.cromosEditados[0].Nombre + this.cromosEditados[0].Nivel);
        
        this.cambios = false;
        this.changed=true;
        Swal.fire("Editado","Enigma editado con éxito",'success');
      } else {
        Swal.fire("Error","No se ha podido editar el enigma",'error');
        console.log('fallo editando');
      }
    });
    // this.dialogRef.close(this.cromosEditados);
 }

 AsignarTipo(){
  this.tipoEnigma= this.selectedType;
  this.cambios=true;
 }

 AsignarDificultad(){
  this.dificultadEnigma= this.selectedDificultad;
  this.cambios=true;
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
    if (this.changed){
    this.dialogRef.close(this.enigmaEscaperoom);
    }else{
      this.dialogRef.close(null);
    }
  }
}

}
