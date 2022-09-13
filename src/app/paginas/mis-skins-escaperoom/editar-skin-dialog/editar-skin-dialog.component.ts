import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ObjetoEscaperoom, Skin } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { EditarEscenaDialogComponent } from '../../mis-escenarios-escaperoom/mis-mapas-escaperoom/editar-escena-dialog/editar-escena-dialog.component';
import 'rxjs';

@Component({
  selector: 'app-editar-skin-dialog',
  templateUrl: './editar-skin-dialog.component.html',
  styleUrls: ['./editar-skin-dialog.component.scss']
})
export class EditarSkinDialogComponent implements OnInit {
  skinEscaperoom: Skin;

  nombreSkin: string;
  imagenSkin: string;
  imagenSkinAntigua: string;


  // imagen y archivo escena
  nombreImagenSkinAntigua: string;
  nombreImageSkinNueva: string;
  fileImagenSkin: File;

  // tslint:disable-next-line:ban-types
  imagenSkinCargada: Boolean = false;

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
    this.skinEscaperoom = this.data.skin;
    this.nombreSkin = this.data.skin.Nombre;
    this.nombreImageSkinNueva= this.data.skin.Spritesheet;
    console.log(this.skinEscaperoom);
    // Cargo el imagen del cromo
    //this.TraeArchivosEscenas();
  }

  EditarEscena() {
    console.log('Entro a editar');
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaSkin(new Skin(this.nombreImageSkinNueva,  this.nombreSkin), this.skinEscaperoom.id,this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        this.skinEscaperoom = res;
        // this.cromosEditados.push (res);
        // console.log('nombre del cromo + nivel' + this.cromosEditados[0].Nombre + this.cromosEditados[0].Nivel);
        if (this.imagenSkinCargada === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          console.log ('Nueva imagen');          
          this.peticionesAPI.BorrarImagenSkin(this.nombreImagenSkinAntigua).subscribe();
          const formData: FormData = new FormData();
          formData.append(this.nombreImageSkinNueva, this.fileImagenSkin);
          this.peticionesAPI.PonImagenSkin(formData)
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
    document.getElementById('inputSkinImagen').click();
}

  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
ExaminarImagenEscena($event) {
  this.fileImagenSkin = $event.target.files[0];

  console.log('fichero ' + this.fileImagenSkin.name);
  this.nombreImagenSkinAntigua=this.nombreImageSkinNueva;
  this.nombreImageSkinNueva = this.fileImagenSkin.name;

  const reader = new FileReader();
  reader.readAsDataURL(this.fileImagenSkin);
  reader.onload = () => {
    console.log('ya Escena');
    this.imagenSkinCargada= true;
    // this.imagenCargadoCromo = true;
    this.imagenSkin = reader.result.toString();
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
        this.dialogRef.close(this.skinEscaperoom);
      }
    });
  } else {
    this.dialogRef.close(this.skinEscaperoom);
  }
}

}
