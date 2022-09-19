import { EscenaEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cromo, Coleccion, EscenarioEscaperoom } from 'src/app/clases';
import { DialogoConfirmacionComponent } from 'src/app/paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { OpcionSeleccionada } from 'src/app/paginas/juego/juego.component';
import { EditarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/editar-cromo-dialog/editar-cromo-dialog.component';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';


import 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editar-escena-dialog',
  templateUrl: './editar-escena-dialog.component.html',
  styleUrls: ['./editar-escena-dialog.component.scss']
})
export class EditarEscenaDialogComponent implements OnInit {
  EscenaEscaperoom: EscenaEscaperoom;
  EscenaEscaperoomCambiada: EscenaEscaperoom;
  EscenasdeEscenario: EscenaEscaperoom[] = [];
  EscenarioEscaperoom: EscenarioEscaperoom;

  nombreEscena: string;
  imagenEscena: string;
  imagenEscenaAntigua: string;
  archivoEscenaAntigua: string;


  // imagen y archivo escena
  nombreImagenEscenaAntigua: string;
  nombreImagenEscenaNueva: string;
  nombreArchivoEscenaAntiguo: string;
  nombreArchivoEscenaNuevo: string;
  fileImagenEscena: File;
  fileArchivoEscena: File;

  // tslint:disable-next-line:ban-types
  imagenEscenaCargada: Boolean = false;
  // tslint:disable-next-line:ban-types
  archivoEscenaCargado: Boolean = false;
  infoArchivoEscena;

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;
  changed: Boolean=false;



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
    this.EscenaEscaperoom = this.data.escena;
    this.EscenarioEscaperoom = this.data.escenario;

    this.nombreEscena = this.EscenaEscaperoom.Nombre;
    this.nombreImagenEscenaNueva= this.data.escena.Tilesheet;
    this.nombreArchivoEscenaNuevo = this.data.escena.Archivo;
    //this.imagenEscenaAntigua = this.EscenaEscaperoom.Tilesheet;
    //this.archivoEscenaAntigua = this.EscenaEscaperoom.Archivo;
    this.EscenasdeEscenario = this.sesion.DameEscenasdeEscenario();

    // this.opcionSeleccionadaProbabilidad = this.cromo.Probabilidad;
    console.log(this.EscenaEscaperoom);
    // Cargo el imagen del cromo
    //this.TraeArchivosEscenas();
  }

  EditarEscena() {
    console.log('Entro a editar');
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaEscenaEscenario(new EscenaEscaperoom( this.nombreArchivoEscenaNuevo, this.nombreImagenEscenaNueva, this.nombreEscena), this.EscenaEscaperoom.escenarioEscapeRoomId, this.EscenaEscaperoom.id)
    .subscribe((res) => {
      if (res != null) {
        this.EscenaEscaperoom = res;
        // this.cromosEditados.push (res);
        // console.log('nombre del cromo + nivel' + this.cromosEditados[0].Nombre + this.cromosEditados[0].Nivel);
        if (this.imagenEscenaCargada === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          console.log ('Nueva imagen');          
          this.peticionesAPI.BorrarImagenEscena(this.nombreImagenEscenaAntigua).subscribe();
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenEscenaNueva, this.fileImagenEscena);
          this.peticionesAPI.PonImagenEscena(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }

        if (this.archivoEscenaCargado === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          console.log ('Nueva imagen');          
          this.peticionesAPI.BorrarImagenEscena(this.nombreArchivoEscenaAntiguo).subscribe();
          const formData: FormData = new FormData();
          formData.append(this.nombreArchivoEscenaNuevo, this.fileArchivoEscena);
          this.peticionesAPI.PonImagenEscena(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }
        Swal.fire("Editada","Escena editada con éxito",'success');
        this.cambios = false;
        this.changed =true;
      } else {
        Swal.fire("Error","No se ha podido editar la escena",'error');
        console.log('fallo editando');
      }
    });
    // this.dialogRef.close(this.cromosEditados);
 }

   // Activa la función ExaminarImagenCromo
ActivarInputImagenEscena() {
    document.getElementById('inputEscenaImagen').click();
}

ActivarInputEscenaArchivo() {
    document.getElementById('inputEscenaArchivo').click();
}

  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
ExaminarImagenEscena($event) {
  this.fileImagenEscena = $event.target.files[0];

  console.log('fichero ' + this.fileImagenEscena.name);


  const reader = new FileReader();
  reader.readAsDataURL(this.fileImagenEscena);
  reader.onload = () => {
    this.nombreImagenEscenaAntigua=this.nombreImagenEscenaNueva;
    this.nombreImagenEscenaNueva = this.fileImagenEscena.name;
    console.log('ya Escena');
    this.imagenEscenaCargada= true;
    // this.imagenCargadoCromo = true;
    this.imagenEscena = reader.result.toString();
    this.cambios=true;
  };
  $event.target.value="";
}
  
ExaminarArchivoEscena($event) {
    this.fileArchivoEscena = $event.target.files[0];
  
  console.log('fichero ' + this.fileArchivoEscena.name);


  const fileInfo = $event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(fileInfo, 'ISO-8859-1');
  reader.onload = () => {
    try {
      this.nombreArchivoEscenaAntiguo = this.nombreArchivoEscenaNuevo;
      this.nombreArchivoEscenaNuevo = this.fileArchivoEscena.name;
          this.infoArchivoEscena = JSON.parse(reader.result.toString());
          this.archivoEscenaCargado =true;
          this.nombreArchivoEscenaNuevo = this.fileArchivoEscena.name;
          this.cambios=true;
    }catch{
      Swal.fire('Archivo JSON no válido','Prueba a subir otro archivo o corregir el existente', 'error')
      this.fileArchivoEscena = undefined;
      //this.nombreArchivoEscenaNuevo = this.nombreArchivoEscenaAntiguo;
    }
  }
  $event.target.value="";
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
      this.dialogRef.close(this.EscenaEscaperoom);
    }else{
      this.dialogRef.close(null);
    }
  }
}

}
