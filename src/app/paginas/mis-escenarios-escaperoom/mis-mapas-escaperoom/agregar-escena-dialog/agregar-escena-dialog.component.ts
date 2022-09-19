import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cromo, EscenaEscaperoom, EscenarioEscaperoom } from 'src/app/clases';
import { OpcionSeleccionada } from 'src/app/paginas/juego/juego.component';
import { AgregarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/agregar-cromo-dialog/agregar-cromo-dialog.component';
import { PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';

import 'rxjs';

@Component({
  selector: 'app-agregar-escena-dialog',
  templateUrl: './agregar-escena-dialog.component.html',
  styleUrls: ['./agregar-escena-dialog.component.scss']
})
export class AgregarEscenaDialogComponent implements OnInit {

EscenarioRecibido: EscenarioEscaperoom;

// CREAR ESCENA
nombreEscena: string;
imagenEscena: string;
ArchivoEscena: string;
EscenasAgregadas: EscenaEscaperoom [] = [];
// tslint:disable-next-line:ban-types

// COMPARTIDO

nombreImagenEscena: string;
nombreArchivoEscena: string;
fileImagenEscena: File;
fileArchivoEscena: File;
infoArchivoEscena;

// Al principio coleccion no creada y imagen no cargada
// tslint:disable-next-line:ban-types

// tslint:disable-next-line:ban-types
imagenCargadaEscena: Boolean = false;
archivoCargadoEscena: Boolean =false;


// PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
displayedColumns: string[] = ['nombreEscena', 'Imagen', 'Archivo', ' '];

  constructor(
                private formBuilder: FormBuilder,
                public dialogRef: MatDialogRef<AgregarEscenaDialogComponent>,
                private peticionesAPI: PeticionesAPIService,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // Recogemos los datos que le pasamos del otro componente
    this.EscenarioRecibido = this.data.escenario;
  }

  // Creamos una cromo y lo añadimos a la coleccion dandole un nombre, una probabilidad, un nivel y una imagen
  AgregarEscenaEscenario() {

    console.log('Entro a asignar el cromo ' + this.nombreEscena);
    console.log('Entro a asignar la escena al escenario' + this.EscenarioRecibido.id);
    console.log(this.nombreImagenEscena );
    console.log(this.nombreArchivoEscena );
    //this.nombreArchivoEscena="pep.json";
    this.peticionesAPI.PonEscenaEscenario(
      new EscenaEscaperoom(this.nombreArchivoEscena, this.nombreImagenEscena, this.nombreEscena),this.EscenarioRecibido.id)
      .subscribe((res) => {
        if (res != null) {
          console.log('asignado correctamente');
          // Añadimos el cromo a la lista
          this.EscenasAgregadas.push(res);
          //this.EscenasAgregadas = this.EscenasAgregadas.filter(result => result.Nombre !== '');
          // this.CromosAgregados(res);
  
          // Hago el POST de la imagen de delante SOLO si hay algo cargado.
          if (this.imagenCargadaEscena === true) {
  
            // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
            const formData: FormData = new FormData();
            formData.append(this.nombreImagenEscena, this.fileImagenEscena);
            this.peticionesAPI.PonImagenEscena(formData)
            .subscribe(() => console.log('Imagen cargada'));
          }
  
          // Hago el POST de la imagen de detras SOLO si hay algo cargado.
          if (this.archivoCargadoEscena === true) {
  
            // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
            const formData: FormData = new FormData();
            formData.append(this.nombreArchivoEscena, this.fileArchivoEscena);
            this.peticionesAPI.PonArchivoEscena(formData)
            .subscribe(() => console.log('Archivo cargado'));
          }
          Swal.fire("Agregada","La escena ha sido agregada con éxito",'success');
          this.LimpiarCampos();
        } else {          
          Swal.fire("Error","La escena no se ha podido agregar",'error');
          console.log('fallo en la asignación');
        }
      });
  }

  // Utilizamos esta función para eliminar un cromo de la base de datos y de la lista de añadidos recientemente
  BorrarEscena(escena: EscenaEscaperoom) {
    console.log('Id cromo ' + escena.id);
    this.peticionesAPI.BorrarEscenaEscaperoom(escena.id)
    .subscribe(() => {
      // Elimino el cromo de la lista
      this.EscenasAgregadas = this.EscenasAgregadas.filter(res => res.id !== escena.id);
      console.log('Cromo borrado correctamente');
  
    });
    if(escena.Tilesheet!== undefined){
    this.peticionesAPI.BorrarImagenEscena (escena.Tilesheet).subscribe();
    }
    if (escena.Archivo !== undefined) {
      this.peticionesAPI.BorrarArchivoEscena (escena.Archivo).subscribe();
    }
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
      
    this.nombreImagenEscena = this.fileImagenEscena.name;
      console.log('ya Escena');
      this.imagenCargadaEscena= true;
      // this.imagenCargadoCromo = true;
      this.imagenEscena = reader.result.toString();
    };
  }
  
  ExaminarArchivoEscena($event) {
    this.fileArchivoEscena = $event.target.files[0];
  
    console.log('fichero ' + this.fileArchivoEscena.name);
    this.nombreArchivoEscena = this.fileArchivoEscena.name;
  
    const fileInfo = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(fileInfo, 'ISO-8859-1');
    reader.onload = () => {
      try {
            this.infoArchivoEscena = JSON.parse(reader.result.toString());
            this.archivoCargadoEscena =true;
      }catch{
        Swal.fire('Archivo JSON no válido','Prueba a subir otro archivo o corregir el existente', 'error')
        this.fileArchivoEscena = undefined;
        this.nombreArchivoEscena = undefined;
      }
    }
  }

  // Limpiamos los campos del cromo
  LimpiarCampos() {
    this.nombreEscena = undefined;
    this.imagenEscena=undefined;
    this.ArchivoEscena=undefined;
    this.nombreImagenEscena = undefined;
    this.nombreArchivoEscena = undefined;

    this.fileImagenEscena=undefined;
    this.fileArchivoEscena=undefined;
    this.infoArchivoEscena=undefined;

    this.imagenCargadaEscena = false;
    this.archivoCargadoEscena =false;
  }

  // Al cerrar el dialogo retorno la lista de cromos que hay que agregar
  Cerrar() {
    this.dialogRef.close(this.EscenasAgregadas);
  }
}
