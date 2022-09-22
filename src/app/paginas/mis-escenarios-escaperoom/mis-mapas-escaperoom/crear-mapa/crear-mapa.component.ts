import { Location } from '@angular/common';
import { EscenaEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTabGroup, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Coleccion, Cromo, EscenarioEscaperoom } from 'src/app/clases';
import { OpcionSeleccionada } from 'src/app/paginas/juego/juego.component';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import Swal from 'sweetalert2';

import {  ActivatedRoute } from '@angular/router';

// Clases

import 'rxjs';



@Component({
  selector: 'app-crear-mapa',
  templateUrl: './crear-mapa.component.html',
  styleUrls: ['./crear-mapa.component.scss']
})
export class CrearMapaComponent implements OnInit {
// Para el paso finalizar limpiar las variables y volver al mat-tab de "Lista de equipos"
@ViewChild('stepper') stepper;
@ViewChild('tabs') tabGroup: MatTabGroup;
myForm: FormGroup;
myForm2: FormGroup;


// CREAR ESCENARIO
nombreEscenario: string;
EscenarioCreado: EscenarioEscaperoom;
descripcionEscenario: string;

// CREAR ESCENA
nombreEscena: string;
imagenEscena: string;
ArchivoEscena: string;
EscenasAgregadas: EscenaEscaperoom [] = [];
// tslint:disable-next-line:ban-types

// COMPARTIDO
profesorId: number;

nombreImagenEscena: string;
nombreArchivoEscena: string;
fileImagenEscena: File;
fileArchivoEscena: File;
infoArchivoEscena;

// Al principio coleccion no creada y imagen no cargada
// tslint:disable-next-line:ban-types
EscenarioYaCreado: Boolean = false;

// tslint:disable-next-line:ban-types
imagenCargadaEscena: Boolean = false;
archivoCargadoEscena: Boolean =false;

// tslint:disable-next-line:ban-types
finalizar: Boolean = false;

// PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
displayedColumns: string[] = ['nombreEscena', 'Imagen', 'Archivo', ' '];

ficherosRepetidos: string[];
errorFicheros = false;

constructor(
  private router: Router,
  public dialog: MatDialog,
  public sesion: SesionService,
  public peticionesAPI: PeticionesAPIService,
  public calculos: CalculosService,
  public location: Location,
  private formBuilder: FormBuilder) { }

ngOnInit() {

  // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
  // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
  this.profesorId = this.sesion.DameProfesor().id;


  // Constructor myForm
  this.myForm = this.formBuilder.group({
   nombreEscenario: ['', Validators.required],
   descripcionEscenario: ['', Validators.required]
  });
  this.myForm2 = this.formBuilder.group({
    nombreEscena : ['', Validators.required]
   });
}

DatosEscenario(){
  this.nombreEscenario=this.myForm.value.nombreEscenario;
  this.descripcionEscenario = this.myForm.value.descripcionEscenario;

}

// Creamos un escenario dandole un nombre y una descripcion
CrearEscenario() {

  this.peticionesAPI.CreaEscenarioEscaperoom (new EscenarioEscaperoom(this.profesorId,this.nombreEscenario, this.descripcionEscenario), this.profesorId)
  .subscribe((res) => {
    if (res != null) {
      console.log ('ESCENARIO CREADO: ' + res.id );
      console.log(res);
      this.EscenarioCreado = res; // Lo metemos en coleccionCreada, y no en coleccion!!
      console.log ('He creado el escenario ' + this.EscenarioCreado.id);

    } else {
      console.log('Fallo en la creación');
    }
  });
}

NavegarA(string: string){
  this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom'+ string]);
}

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
        },error=>{});          
      });        
      resolve([contImages,contArchivos]);
    });
  });
}

// Creamos una cromo y lo añadimos a la coleccion dandole un nombre, una probabilidad, un nivel y una imagen
AgregarEscenaEscenario() {

  console.log('Entro a asignar el cromo ' + this.nombreEscena);
  console.log('Entro a asignar el cromo a la coleccionID' + this.EscenarioCreado.id);
  console.log(this.nombreImagenEscena );
  console.log(this.nombreArchivoEscena );
  //this.nombreArchivoEscena="pep.json";
  this.ComprobarImagenesyArchivosEscena(this.nombreImagenEscena,this.nombreArchivoEscena)
  .then(data=>{
    if(data[0]==0 && data[1]==0){
      this.peticionesAPI.PonEscenaEscenario(
        new EscenaEscaperoom(this.nombreArchivoEscena, this.nombreImagenEscena, this.nombreEscena),this.EscenarioCreado.id)
        .subscribe((res) => {
          if (res != null) {
            console.log('asignado correctamente');
            // Añadimos el cromo a la lista
            this.EscenasAgregadas.push(res);
            //this.EscenasAgregadas = this.EscenasAgregadas.filter(result => result.Nombre !== '');
            // this.CromosAgregados(res);
    
            // Hago el POST de la imagen de delante SOLO si hay algo cargado.
            if (this.imagenEscena !== undefined) {
    
              // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
              const formData: FormData = new FormData();
              formData.append(this.nombreImagenEscena, this.fileImagenEscena,this.nombreImagenEscena);
              this.peticionesAPI.PonImagenEscena(formData)
              .subscribe(() => console.log('Imagen cargada'));
            }
    
            // Hago el POST de la imagen de detras SOLO si hay algo cargado.
            if (this.ArchivoEscena !== undefined) {
    
              // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
              const formData: FormData = new FormData();
              formData.append(this.nombreArchivoEscena, this.fileArchivoEscena,this.nombreArchivoEscena);
              this.peticionesAPI.PonArchivoEscena(formData)
              .subscribe(() => console.log('Archivo cargado'));
            }
            //Swal.fire("Agregada","Escena agregada con éxito",'success');
            this.LimpiarCampos();
          } else {
            Swal.fire("Error","La escena no se ha podido agregar",'error');
            console.log('fallo en la asignación');
          }
        });
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

// Activa la función ExaminarImagenCromoDelante
ActivarInputImagenEscena() {
  console.log('Activar input');
  document.getElementById('inputEscenaImagen').click();
}

  // Activa la función ExaminarImagenCromoDetras
ActivarInputEscenaArchivo() {
    console.log('Activar input');
    document.getElementById('inputEscenaArchivo').click();
}


// Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
// nombre de la foto en la variable nombreImagen

ExaminarImagenEscena($event) {
  this.fileImagenEscena = $event.target.files[0];

  console.log('fichero ' + this.profesorId+this.fileImagenEscena.name);


  const reader = new FileReader();
  reader.readAsDataURL(this.fileImagenEscena);
  reader.onload = () => {
    this.nombreImagenEscena = this.profesorId+this.fileImagenEscena.name;
    console.log('ya Escena');
    this.imagenCargadaEscena= true;
    // this.imagenCargadoCromo = true;
    this.imagenEscena = reader.result.toString();
  };
  $event.target.value="";
}

ExaminarArchivoEscena($event) {
  this.fileArchivoEscena = $event.target.files[0];

  console.log('fichero ' + this.profesorId+this.fileArchivoEscena.name);
  const fileInfo = $event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(fileInfo, 'ISO-8859-1');
  reader.onload = () => {
    try {
      this.nombreArchivoEscena = this.profesorId+this.fileArchivoEscena.name;
          this.infoArchivoEscena = JSON.parse(reader.result.toString());
          this.archivoCargadoEscena =true;
    }catch{
      Swal.fire('Archivo JSON no válido','Prueba a subir otro archivo o corregir el existente', 'error')
      this.fileArchivoEscena = undefined;
      this.nombreArchivoEscena = undefined;
    }
  }
  $event.target.value="";
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

// Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado.
// Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
  // Función que se activará al clicar en finalizar el último paso del stepper
Finalizar() {
    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.myForm.reset();
    this.myForm2.reset();
    this.stepper.reset();

    // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
    this.EscenarioYaCreado = false;
    this.imagenCargadaEscena = false;
    this.archivoCargadoEscena = false;
    this.imagenEscena = undefined;
    this.ArchivoEscena = undefined;
    this.nombreArchivoEscena = undefined;
    this.nombreEscena = undefined;
    this.nombreEscenario = undefined;
    this.EscenasAgregadas = [];
    this.EscenarioCreado = undefined;
    this.descripcionEscenario = undefined;
    this.nombreImagenEscena = undefined;
    this.fileArchivoEscena= undefined;
    this.fileImagenEscena = undefined;
    this.infoArchivoEscena = undefined;

    this.finalizar = true;
    Swal.fire('Escenario creado con éxito', '', 'success');
    this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas']);

}

}
