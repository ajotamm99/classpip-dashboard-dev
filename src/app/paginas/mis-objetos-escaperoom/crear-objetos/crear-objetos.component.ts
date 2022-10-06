import { Imagen } from './../../../clases/clasesParaLibros/recursosCargaImagen';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { ObjetoEscaperoom } from './../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTabGroup, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { EscenarioEscaperoom, EscenaEscaperoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import 'rxjs';
import { PivotSchemaDesignerComponent } from 'ej-angular2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-crear-objetos',
  templateUrl: './crear-objetos.component.html',
  styleUrls: ['./crear-objetos.component.scss']
})
export class CrearObjetosComponent implements OnInit {
  @ViewChild('stepper') stepper;
  @ViewChild('select') select;
  @ViewChild('tabs') tabGroup: MatTabGroup;
  myForm: FormGroup;

  selectedType: string;
  
  
  // CREAR ESCENARIO
  nombreObjeto: string;
  ObjetoCreado: ObjetoEscaperoom;
  prueba: EscenaEscaperoom;
  
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
  
    console.log(this.selectedType);
  
  }


  ComprobarImagenesObjetos(comprobar: String){
    return new Promise ((resolve, reject)=>{
      this.peticionesAPI.DameObjetosEscaperoomDelProfesor(this.profesorId).subscribe(data=>{
        var lista= data;
        var cont=0;
        for(let i =0; i<lista.length&&cont<1;i++){
          if(comprobar==lista[i].Imagen){
            cont++;
          }
        }
        resolve(cont);
      },(error)=>{
        reject(-1);
      })

    })
  }
  
  // Creamos un escenario dandole un nombre y una descripcion
  CrearObjeto() {

    this.ComprobarImagenesObjetos(this.nombreImagenObjeto)
    .then((cont)=>{
      if (cont==0){
        this.peticionesAPI.PonObjetoEscaperoom(new ObjetoEscaperoom(this.nombreObjeto,this.nombreImagenObjeto), this.profesorId)
      .subscribe((res) => {
        if (res != null) {
          console.log ('OBJETO CREADO: ' + res.id );
          console.log(res);
          if (this.imagenObjeto !== undefined) {
    
            // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
            const formData: FormData = new FormData();
            formData.append(this.nombreImagenObjeto, this.fileImagenObjeto,this.nombreImagenObjeto);
            this.peticionesAPI.PonImagenObjeto(formData)
            .subscribe(() => console.log('Imagen cargada'));
          }        
          this.LimpiarCampos();
          this.stepper.previous();
          Swal.fire('Creado',"Objeto creado con éxito",'success');
        } else {
          console.log('Fallo en la creación');
          Swal.fire('Error',"Fallo creando el objeto",'error');
        }
      },(error)=>{      
        Swal.fire('Error',"Fallo creando el objeto",'error');
      });
      }else if(cont>0){        
        Swal.fire('Error',"Ya existe un objeto con esa imagen",'error');
      }else{
        Swal.fire('Error',"Error en el servidor",'error');
      }
      
    })
    
  }
  
  
  // Activa la función ExaminarImagenCromoDelante
  ActivarInputImagenObjeto() {
    console.log('Activar input');
    document.getElementById('inputObjetoImagen').click();
  }
  
  
  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
  
  ExaminarImagenObjeto($event) {
    this.fileImagenObjeto = $event.target.files[0];
  
    console.log('fichero ' + this.fileImagenObjeto.name);
  
    const reader = new FileReader();
    reader.readAsDataURL(this.fileImagenObjeto);
    reader.onload = () => {
      this.nombreImagenObjeto = this.profesorId+this.fileImagenObjeto.name;
      console.log('ya Escena');
      this.imagenCargadaObjeto= true;
      // this.imagenCargadoCromo = true;
      this.imagenObjeto = reader.result.toString();
    };
    $event.target.value="";
  }

  
  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.nombreObjeto = undefined;
      this.imagenObjeto=undefined;
      this.nombreImagenObjeto = undefined;
      this.fileImagenObjeto=undefined;
  
      this.imagenCargadaObjeto = false;
      this.stepper.reset();
      this.select.value='';
      this.myForm.reset();
  
  }
  
  // Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado.
  // Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
    // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.myForm.reset();
      this.select.value='';
      this.stepper.reset();
      // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
      this.LimpiarCampos()
      Swal.fire('objeto creado con éxito', '', 'success');
      this.router.navigate(['/inicio/' + this.profesorId]);
  }

  Volver(){
    this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misObjetos'])
  }
  
}
