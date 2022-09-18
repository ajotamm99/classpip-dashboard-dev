import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTabGroup, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Enigma, ObjetoEscaperoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import 'rxjs';


interface Types{
  nombre: string;
  id: string
}
interface Dificultades{
  nombre: string;
  id: string;
}

@Component({
  selector: 'app-crear-enigmas',
  templateUrl: './crear-enigmas.component.html',
  styleUrls: ['./crear-enigmas.component.scss']
})

export class CrearEnigmasComponent implements OnInit {
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  myForm: FormGroup;

  selectedType: string;
  selectedDificultad: string;

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

  // CREAR ESCENARIO
  nombreEnigma: string;
  tipoEnigma: string;
  dificultadEnigma: string;
  EnigmaCreado: Enigma;
  
  // CREAR ESCENA
  //imagenObjeto: string;
  // tslint:disable-next-line:ban-types
  
  // COMPARTIDO
  profesorId: number;
  
  //nombreImagenObjeto: string;
  //fileImagenObjeto: File;
  
  // tslint:disable-next-line:ban-types
  //imagenCargadaObjeto: Boolean = false;
  
  
  // PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR

  
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
    this.selectedDificultad = this.dificultades[0].id;
    this.dificultadEnigma = this.selectedDificultad;
    this.selectedType = this.types[0].id;
    this.tipoEnigma=this.selectedType;  
    // Constructor myForm
    this.myForm = this.formBuilder.group({
     nombreEnigma: ['', Validators.required]
    });
  }
  
  DatosEnigma(){
    this.nombreEnigma=this.myForm.value.nombreEnigma;
    this.EnigmaCreado.Nombre=this.nombreEnigma;
    this.EnigmaCreado.Tipo=this.tipoEnigma;
    this.EnigmaCreado.Dificultad = this.dificultadEnigma;
  
  }

  AsignarTipo(){
    this.tipoEnigma= this.selectedType;
  }
  AsignarDificultad(){
    this.dificultadEnigma = this.selectedDificultad;
  }
  
  // Creamos un escenario dandole un nombre y una descripcion
  CrearEnigma() {
  
    this.peticionesAPI.PonEnigmaEscaperoom (new Enigma(this.tipoEnigma,this.nombreEnigma, this.dificultadEnigma), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log ('ENIGMA CREADO: ' + res.id );
        console.log(res);
  
      } else {
        console.log('Fallo en la creación');
      }
    });
    
    this.LimpiarCampos();
    this.myForm.reset();
    this.stepper.reset();
    //this.stepper.previous();
  }
  

  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.nombreEnigma = undefined;
      this.tipoEnigma =undefined;
      this.dificultadEnigma = undefined;
  
  }
  

    // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.myForm.reset();
      this.stepper.reset();
  
      // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
      this.LimpiarCampos()
      Swal.fire('ENIGMA creado con éxito', '', 'success');
      this.router.navigate(['/inicio/' + this.profesorId]);
  }

  Volver(){
    this.router.navigate(['/inicio/' + this.profesorId +'/recursos/misRecursosEscaperoom/misEnigmas']);
  }
  
}
