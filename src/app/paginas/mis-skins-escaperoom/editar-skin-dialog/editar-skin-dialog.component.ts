import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ObjetoEscaperoom, Skin } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import 'rxjs';
import * as URL from '../../../URLs/urls';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-skin-dialog',
  templateUrl: './editar-skin-dialog.component.html',
  styleUrls: ['./editar-skin-dialog.component.scss']
})
export class EditarSkinDialogComponent implements OnInit {

  
  skinEscaperoom: Skin;
  skinsEscaperoom: Skin[]=[];

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
  changed: Boolean =false;
  profesorId: number;



  constructor(
              public dialog: MatDialog,
              // private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditarSkinDialogComponent>,
              private http: Http,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.profesorId =this.sesion.DameProfesor().id;
    this.skinsEscaperoom = this.sesion.DameSkinsEscaperoom();
    this.skinEscaperoom = this.data.skin;
    this.nombreSkin = this.data.skin.Nombre;
    this.nombreImageSkinNueva= this.data.skin.Spritesheet;
    this.imagenSkinAntigua= URL.ImagenesSkins+this.nombreImageSkinNueva;
    console.log(this.skinEscaperoom);
    // Cargo el imagen del cromo
    //this.TraeArchivosEscenas();
  }

  ComprobarImagenesSkins(comprobar: String,skinId:number){
    
    return new Promise ((resolve, reject)=>{
      this.peticionesAPI.DameSkinsEscaperoomDelProfesor(this.profesorId).subscribe(data=>{
          var cont=0;
          for(let i =0; i<data.length && cont<1;i++){
            if(data[i].id!=skinId){
              if(comprobar==data[i].Spritesheet){
                cont++;
              }
            }
          }
          resolve(cont);

      },(error)=>{
        reject(-1);
      })

    })
  }

  EditarSkin() {
    console.log('Entro a editar');
    this.ComprobarImagenesSkins(this.nombreImageSkinNueva,this.skinEscaperoom.id)
    .then(cont=>{
      if(cont==0){
        var skin=new Skin(this.nombreImageSkinNueva,  this.nombreSkin);
        skin.Publica=this.skinEscaperoom.Publica;
        this.peticionesAPI.ModificaSkin(skin, this.skinEscaperoom.id,this.profesorId)
        .subscribe((res) => {
          if (res != null) {
            this.skinEscaperoom = res;
            // this.cromosEditados.push (res);
            // console.log('nombre del cromo + nivel' + this.cromosEditados[0].Nombre + this.cromosEditados[0].Nivel);
            if (this.imagenSkinCargada === true) {
              // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
              console.log ('Nueva imagen');
              var cont=0;
              //var search = this.skinsEscaperoom.find(sk=> sk.id== this.skinEscaperoom.id)[0];
              //var index = this.skinsEscaperoom.indexOf(search);
              for(let i=0; i<this.skinsEscaperoom.length; i++ ){
                if(this.skinsEscaperoom[i].Spritesheet ==this.nombreImagenSkinAntigua){
                  cont++;
                }
              }
              if(cont<2){
                this.peticionesAPI.BorrarImagenSkin(this.nombreImagenSkinAntigua).subscribe();
              }
              this.skinsEscaperoom.splice(this.skinsEscaperoom.findIndex(sk=> sk.id== this.skinEscaperoom.id),1,this.skinEscaperoom);
              const formData: FormData = new FormData();
              formData.append(this.nombreImageSkinNueva, this.fileImagenSkin, this.nombreImageSkinNueva);
              this.peticionesAPI.PonImagenSkin(formData)
              .subscribe(() => console.log('Imagen cargado'));
              this.imagenSkinAntigua=this.imagenSkin;
              this.imagenSkinCargada=false;
            }
            Swal.fire("Editada","Skin editada con éxito",'success');
            this.changed=true;
            this.cambios = false;
          } else {
            
            Swal.fire("Error","No se ha podido editar la skin",'error');
            console.log('fallo editando');
          }
        });
     }else if(cont>0){      
      Swal.fire("Error","Ya existe una skin con esa imagen",'error');
     }else{
      Swal.fire("Error","Error en el servidor",'error')
     }

    })
    // tslint:disable-next-line:max-line-length
    
    // this.dialogRef.close(this.cromosEditados);
 }

   // Activa la función ExaminarImagenCromo
ActivarInputImagenSkin() {
    document.getElementById('inputSkinImagen').click();
}

  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen
ExaminarImagenSkin($event) {
  this.fileImagenSkin = $event.target.files[0];

  console.log('fichero ' + this.fileImagenSkin.name);


  const reader = new FileReader();
  reader.readAsDataURL(this.fileImagenSkin);
  reader.onload = () => {
    var date = new Date();
    var timestamp= (date.getFullYear()).toString()+(date.getMonth).toString()+(date.getDay).toString()
      +(date.getHours).toString()+(date.getMinutes).toString()+(date.getSeconds).toString()+(date.getMilliseconds).toString();
      
    console.log('ya Escena');
    this.nombreImagenSkinAntigua=this.nombreImageSkinNueva;
    this.nombreImageSkinNueva = timestamp+this.profesorId+this.fileImagenSkin.name;
    this.imagenSkinCargada= true;
    this.cambios=true;
    // this.imagenCargadoCromo = true;
    this.imagenSkin = reader.result.toString();
  };
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
      this.dialogRef.close(this.skinEscaperoom);
    }else{
      this.dialogRef.close(null);
    }
    
  }
}

}
