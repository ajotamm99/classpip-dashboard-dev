import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Cromo, EscenaEscaperoom, EscenarioEscaperoom } from 'src/app/clases';
import { OpcionSeleccionada } from 'src/app/paginas/juego/juego.component';
import { AgregarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/agregar-cromo-dialog/agregar-cromo-dialog.component';
import { PeticionesAPIService, SesionService } from 'src/app/servicios';
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
EscenasAgregadasMostrar: EscenaEscaperoom[]=[];
dataSourceMostrar;
// tslint:disable-next-line:ban-types


nombreImagenEscena: string;
nombreImagenEscenaMostrar: string;
nombreArchivoEscena: string;
nombreArchivoEscenaMostrar:string;
fileImagenEscena: File;
fileArchivoEscena: File;
infoArchivoEscena;

// Al principio coleccion no creada y imagen no cargada
// tslint:disable-next-line:ban-types

// tslint:disable-next-line:ban-types
imagenCargadaEscena: Boolean = false;
archivoCargadoEscena: Boolean =false;

profesorId: number;


// PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
displayedColumns: string[] = ['nombreEscena', 'Imagen', 'Archivo', ' '];

  constructor(
                private formBuilder: FormBuilder,
                public dialogRef: MatDialogRef<AgregarEscenaDialogComponent>,
                private peticionesAPI: PeticionesAPIService,                
                private sesion: SesionService,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // Recogemos los datos que le pasamos del otro componente
    this.EscenarioRecibido = this.data.escenario;
    this.profesorId=this.sesion.DameProfesor().id;
  }
/*
  ComprobarImagenesyArchivosEscena(comprobarImagen: String, comprobarArchivo: String){
    
    return new Promise ((resolve, reject)=>{
      this.peticionesAPI.DameEscenariosEscaperoomDelProfesor(this.profesorId)
      .subscribe(data=>{
        var contImages=0;
        var contArchivos=0;
        var filter=data;
        //var lista:EscenaEscaperoom[]=[];
        filter.forEach(sc => {
          this.peticionesAPI.DameEscenasdeEscenariosEscaperoom(sc.id)
          .subscribe(data=>{
            for(let i =0; i<data.length && (contArchivos<1 || contImages<1);i++){
                if(comprobarArchivo==data[i].Archivo){
                  contArchivos++;
                }
                if(comprobarImagen==data[i].Tilesheet){
                  contImages++;
                }                      
            }            
            resolve([contImages,contArchivos]);
          },error=>{});          
        });        
      });
    });
  }
  */

  AgregarEscenaEscenario() {

    /*
    this.ComprobarImagenesyArchivosEscena(this.nombreImagenEscena,this.nombreArchivoEscena)
    .then(data=>{
      console.log(data);

      if(data[0]==0 && data[1]==0){
        */
        this.peticionesAPI.PonEscenaEscenario(
          new EscenaEscaperoom(this.nombreArchivoEscena, this.nombreImagenEscena, this.nombreEscena),this.EscenarioRecibido.id)
          .subscribe((res) => {
            if (res != null) {
              this.EscenasAgregadas.push(res);
              var Escena =new EscenaEscaperoom(this.nombreArchivoEscenaMostrar,this.nombreImagenEscenaMostrar,res.Nombre,res.escenarioEscapeRoomId);
              Escena.Publica=res.Publica;
              Escena.id=res.id;
              this.EscenasAgregadasMostrar.push(Escena);
              this.dataSourceMostrar= new MatTableDataSource(this.EscenasAgregadasMostrar);
              
              // Hago el POST de la imagen de delante SOLO si hay algo cargado.
              if (this.imagenCargadaEscena === true && this.archivoCargadoEscena===true) {
      
                // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
                const formData: FormData = new FormData();
                formData.append(this.nombreImagenEscena, this.fileImagenEscena,this.nombreImagenEscena);
                this.peticionesAPI.PonImagenEscena(formData)
                .subscribe(() => {
                  const formData: FormData = new FormData();
                  formData.append(this.nombreArchivoEscena, this.fileArchivoEscena,this.nombreArchivoEscena);
                  this.peticionesAPI.PonArchivoEscena(formData)
                  .subscribe(() => {
                    Swal.fire("Agregada","La escena ha sido agregada con éxito",'success');
                    this.LimpiarCampos();
                  })
                  
                });
              }
            } else {          
              Swal.fire("Error","La escena no se ha podido agregar",'error');
            }
          },error=>{
            Swal.fire("Error","Inserte imagen y archivo",'error');
          });
          /*
      }else if(data[0]>0 && data[1]>0){        
        Swal.fire("Error","Ya hay escenas con este nombre de archivo e imagen",'error');
      }else if(data[0]>0 && data[1]==0){        
        Swal.fire("Error","Ya hay escenas con este nombre de imagen",'error');
      }else if(data[0]==0 && data[1]>0){        
        Swal.fire("Error","Ya hay escenas con este nombre de archivo",'error');
      }else{
        Swal.fire("Error","Error en el servidor",'error');
      }
    });
    */
  }

  BorrarEscena(escena: EscenaEscaperoom) {
    this.peticionesAPI.BorrarEscenaEscaperoom(escena.id)
    .subscribe(() => {
      this.EscenasAgregadas = this.EscenasAgregadas.filter(res => res.id !== escena.id);
      this.EscenasAgregadasMostrar = this.EscenasAgregadasMostrar.filter(res => res.id !== escena.id);
      this.dataSourceMostrar= new MatTableDataSource(this.EscenasAgregadasMostrar);

      Swal.fire("Eliminada","Escena eliminada con éxito", 'success');
  
    });
    if(escena.Tilesheet!== undefined){
    this.peticionesAPI.BorrarImagenEscena (escena.Tilesheet).subscribe();
    }
    if (escena.Archivo !== undefined) {
      this.peticionesAPI.BorrarArchivoEscena (escena.Archivo).subscribe();
    }
  }

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
  
  
    const reader = new FileReader();
    reader.readAsDataURL(this.fileImagenEscena);
    reader.onload = () => {
      var date = new Date();
      var timestamp= (date.getFullYear()).toString()+(date.getMonth()).toString()+(date.getDay()).toString()
        +(date.getHours()).toString()+(date.getMinutes()).toString()+(date.getSeconds()).toString()+(date.getMilliseconds()).toString();
        
      
    this.nombreImagenEscena = timestamp+this.profesorId+this.fileImagenEscena.name;
    this.nombreImagenEscenaMostrar=this.fileImagenEscena.name;

      this.imagenCargadaEscena= true;
      // this.imagenCargadoCromo = true;
      this.imagenEscena = reader.result.toString();
    };
  }
  
  ExaminarArchivoEscena($event) {
    this.fileArchivoEscena = $event.target.files[0];
  
  
    const fileInfo = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(fileInfo, 'ISO-8859-1');
    reader.onload = () => {
      try {
        var date = new Date();
        var timestamp= (date.getFullYear()).toString()+(date.getMonth()).toString()+(date.getDay()).toString()
          +(date.getHours()).toString()+(date.getMinutes()).toString()+(date.getSeconds()).toString()+(date.getMilliseconds()).toString();
          
        this.infoArchivoEscena = JSON.parse(reader.result.toString());        
        this.nombreArchivoEscena = timestamp+this.profesorId+this.fileArchivoEscena.name;         
        this.nombreArchivoEscenaMostrar= this.fileArchivoEscena.name;
        this.archivoCargadoEscena =true;
      }catch{
        Swal.fire('Archivo JSON no válido','Prueba a subir otro archivo o corregir el existente', 'error')
        this.fileArchivoEscena = undefined;
        this.nombreArchivoEscena = undefined;
        this.nombreArchivoEscenaMostrar= undefined;
      }
    }
  }

  // Limpiamos los campos
  LimpiarCampos() {
    this.nombreEscena = undefined;
    this.imagenEscena=undefined;
    this.ArchivoEscena=undefined;
    this.nombreImagenEscena = undefined;
    this.nombreImagenEscenaMostrar=undefined;
    this.nombreArchivoEscena = undefined;
    this.nombreArchivoEscenaMostrar=undefined;

    this.fileImagenEscena=undefined;
    this.fileArchivoEscena=undefined;
    this.infoArchivoEscena=undefined;

    this.imagenCargadaEscena = false;
    this.archivoCargadoEscena =false;
  }

  Cerrar() {
    this.dialogRef.close(this.EscenasAgregadas);
  }
}
