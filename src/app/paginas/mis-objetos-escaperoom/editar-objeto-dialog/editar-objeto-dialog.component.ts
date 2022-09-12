import { Imagen } from './../../../clases/clasesParaLibros/recursosCargaImagen';
import { ObjetoEscaperoom } from './../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EscenaEscaperoom, EscenarioEscaperoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import 'rxjs';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { EditarEscenaDialogComponent } from '../../mis-escenarios-escaperoom/mis-mapas-escaperoom/editar-escena-dialog/editar-escena-dialog.component';

@Component({
  selector: 'app-editar-objeto-dialog',
  templateUrl: './editar-objeto-dialog.component.html',
  styleUrls: ['./editar-objeto-dialog.component.scss']
})
export class EditarObjetoDialogComponent implements OnInit {
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
              public dialogRef: MatDialogRef<EditarEscenaDialogComponent>,
              private http: Http,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.profesorId =this.sesion.DameProfesor().id;
    this.ObjetoEscaperoom = this.data.objeto;
    this.nombreObjeto = this.data.objeto.Nombre;
    this.nombreImagenObjetoNueva= this.data.objeto.Imagen;
    this.tipoObjeto = this.data.objeto.Tipo;
    //this.imagenEscenaAntigua = this.EscenaEscaperoom.Tilesheet;
    //this.archivoEscenaAntigua = this.EscenaEscaperoom.Archivo;

    // this.opcionSeleccionadaProbabilidad = this.cromo.Probabilidad;
    console.log(this.ObjetoEscaperoom);
    // Cargo el imagen del cromo
    //this.TraeArchivosEscenas();
  }

  EditarEscena() {
    console.log('Entro a editar');
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaObjeto(new ObjetoEscaperoom(this.nombreObjeto,  this.nombreImagenObjetoNueva, this.tipoObjeto), this.ObjetoEscaperoom.id,this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        this.ObjetoEscaperoom = res;
        // this.cromosEditados.push (res);
        // console.log('nombre del cromo + nivel' + this.cromosEditados[0].Nombre + this.cromosEditados[0].Nivel);
        if (this.imagenObjetoCargada === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          console.log ('Nueva imagen');          
          this.peticionesAPI.BorrarImagenObjeto(this.nombreImagenObjetoAntigua).subscribe();
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenObjetoNueva, this.fileImagenObjeto);
          this.peticionesAPI.PonImagenObjeto(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }
        
        this.cambios = false;
      } else {
        console.log('fallo editando');
      }
    });
    // this.dialogRef.close(this.cromosEditados);
 }

   // Activa la función ExaminarImagenCromo
ActivarInputImagenObjeto() {
    document.getElementById('inputObjetoImagen').click();
}

  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
ExaminarImagenEscena($event) {
  this.fileImagenObjeto = $event.target.files[0];

  console.log('fichero ' + this.fileImagenObjeto.name);
  this.nombreImagenObjetoAntigua=this.nombreImagenObjetoNueva;
  this.nombreImagenObjetoNueva = this.fileImagenObjeto.name;

  const reader = new FileReader();
  reader.readAsDataURL(this.fileImagenObjeto);
  reader.onload = () => {
    console.log('ya Escena');
    this.imagenObjetoCargada= true;
    // this.imagenCargadoCromo = true;
    this.imagenObjeto = reader.result.toString();
  };
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
        this.dialogRef.close(this.ObjetoEscaperoom);
      }
    });
  } else {
    this.dialogRef.close(this.ObjetoEscaperoom);
  }
}

}
