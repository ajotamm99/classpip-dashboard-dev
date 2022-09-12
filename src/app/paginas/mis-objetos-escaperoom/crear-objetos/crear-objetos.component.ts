import { MatStepper } from '@angular/material/stepper';
import { ObjetoEscaperoom } from './../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTabGroup, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EscenarioEscaperoom, EscenaEscaperoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import 'rxjs';
import { PivotSchemaDesignerComponent } from 'ej-angular2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

interface Type{
  nombre: string;
  id: string;
}
@Component({
  selector: 'app-crear-objetos',
  templateUrl: './crear-objetos.component.html',
  styleUrls: ['./crear-objetos.component.scss']
})
export class CrearObjetosComponent implements OnInit {
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  myForm: FormGroup;

  selectedType: string;

  types: Type[]=[
    {nombre:'Enigma', id:'enigma'},
    {nombre:'Pista', id: 'pista'},
    {nombre:'Otros', id: 'otros'}
  ]
  
  
  // CREAR ESCENARIO
  nombreObjeto: string;
  tipoObjeto: string;
  ObjetoCreado: ObjetoEscaperoom;
  
  // CREAR ESCENA
  imagenObjeto: string;
  // tslint:disable-next-line:ban-types
  
  // COMPARTIDO
  profesorId: number;
  
  nombreImagenObjeto: string;
  fileImagenObjeto: File;
  
  // tslint:disable-next-line:ban-types
  imagenCargadaObjeto: Boolean = false;
  
  
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
  
  
    // Constructor myForm
    this.myForm = this.formBuilder.group({
     nombreObjeto: ['', Validators.required]
    });
  }
  
  DatosObjeto(){
    this.nombreObjeto=this.myForm.value.nombreObjeto;
    this.ObjetoCreado.Nombre=this.nombreObjeto;
    this.ObjetoCreado.Tipo=this.tipoObjeto;
  
  }

  AsignarTipo(){
    this.tipoObjeto= this.selectedType;
  }
  
  // Creamos un escenario dandole un nombre y una descripcion
  CrearObjeto() {
  
    this.peticionesAPI.PonObjetoEscaperoom (new ObjetoEscaperoom(this.nombreObjeto,this.nombreImagenObjeto, this.tipoObjeto), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log ('OBJETO CREADO: ' + res.id );
        console.log(res);
        if (this.imagenObjeto !== undefined) {
  
          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenObjeto, this.fileImagenObjeto);
          this.peticionesAPI.PonImagenObjeto(formData)
          .subscribe(() => console.log('Imagen cargada'));
        }
  
      } else {
        console.log('Fallo en la creación');
      }
    });
    
    this.LimpiarCampos();
    this.stepper.previous();
  }
  
  
  // Activa la función ExaminarImagenCromoDelante
  ActivarInputImagenObjeto() {
    console.log('Activar input');
    document.getElementById('inputEscenaObjeto').click();
  }
  
  
  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
  
  ExaminarImagenObjeto($event) {
    this.fileImagenObjeto = $event.target.files[0];
  
    console.log('fichero ' + this.fileImagenObjeto.name);
    this.nombreImagenObjeto = this.fileImagenObjeto.name;
  
    const reader = new FileReader();
    reader.readAsDataURL(this.fileImagenObjeto);
    reader.onload = () => {
      console.log('ya Escena');
      this.imagenCargadaObjeto= true;
      // this.imagenCargadoCromo = true;
      this.imagenObjeto = reader.result.toString();
    };
  }

  
  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.nombreObjeto = undefined;
      this.imagenObjeto=undefined;
      this.nombreImagenObjeto = undefined;
      this.fileImagenObjeto=undefined;
  
      this.imagenCargadaObjeto = false;
  
  }
  
  // Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado.
  // Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
    // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.myForm.reset();
      this.stepper.reset();
  
      // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
      this.LimpiarCampos()
      Swal.fire('objeto creado con éxito', '', 'success');
      this.router.navigate(['/inicio/' + this.profesorId]);
  }
  
}
