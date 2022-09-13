import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTabGroup, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ObjetoEscaperoom, Skin } from 'src/app/clases';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import 'rxjs';

@Component({
  selector: 'app-crear-skins',
  templateUrl: './crear-skins.component.html',
  styleUrls: ['./crear-skins.component.scss']
})
export class CrearSkinsComponent implements OnInit {
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  myForm: FormGroup;

  
  
  // CREAR ESCENARIO
  nombreSkin: string;
  SkinCreada: Skin;
  
  // CREAR ESCENA
  imagenSkin: string;
  // tslint:disable-next-line:ban-types
  
  // COMPARTIDO
  profesorId: number;
  
  nombreImagenSkin: string;
  fileImagenSkin: File;
  
  // tslint:disable-next-line:ban-types
  imagenCargadaSkin: Boolean = false;
  
  
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
     nombreSkin: ['', Validators.required]
    });
  }
  
  DatosObjeto(){
    this.nombreSkin=this.myForm.value.nombreObjeto;
    this.SkinCreada.Nombre=this.nombreSkin;
  
  }
  
  // Creamos un escenario dandole un nombre y una descripcion
  CrearSkin() {
  
    this.peticionesAPI.PonSkinEscaperoom (new Skin(this.nombreSkin,this.nombreImagenSkin), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        console.log ('SKIN CREADa: ' + res.id );
        console.log(res);
        if (this.imagenSkin !== undefined) {
  
          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
          const formData: FormData = new FormData();
          formData.append(this.nombreImagenSkin, this.fileImagenSkin);
          this.peticionesAPI.PonImagenSkin(formData)
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
  ActivarInputImagenSkin() {
    console.log('Activar input');
    document.getElementById('inputSkinImagen').click();
  }
  
  
  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
  
  ExaminarImagenObjeto($event) {
    this.fileImagenSkin = $event.target.files[0];
  
    console.log('fichero ' + this.fileImagenSkin.name);
    this.nombreImagenSkin = this.fileImagenSkin.name;
  
    const reader = new FileReader();
    reader.readAsDataURL(this.fileImagenSkin);
    reader.onload = () => {
      console.log('ya Escena');
      this.imagenCargadaSkin= true;
      // this.imagenCargadoCromo = true;
      this.imagenSkin = reader.result.toString();
    };
  }

  
  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.nombreSkin = undefined;
      this.imagenSkin=undefined;
      this.nombreImagenSkin = undefined;
      this.fileImagenSkin=undefined;
  
      this.imagenCargadaSkin = false;
  
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
      Swal.fire('skin creado con éxito', '', 'success');
      this.router.navigate(['/inicio/' + this.profesorId]);
  }
  
}

