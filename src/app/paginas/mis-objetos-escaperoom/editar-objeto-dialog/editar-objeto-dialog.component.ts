import { Imagen } from './../../../clases/clasesParaLibros/recursosCargaImagen';
import { ObjetoEscaperoom } from './../../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EscenaEscaperoom, EscenarioEscaperoom, Skin } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import 'rxjs';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { EditarEscenaDialogComponent } from '../../mis-escenarios-escaperoom/mis-mapas-escaperoom/editar-escena-dialog/editar-escena-dialog.component';

import * as URL from '../../../URLs/urls';


@Component({
  selector: 'app-editar-objeto-dialog',
  templateUrl: './editar-objeto-dialog.component.html',
  styleUrls: ['./editar-objeto-dialog.component.scss']
})
export class EditarObjetoDialogComponent implements OnInit {
  @ViewChild('select') select;

  ObjetoEscaperoom: ObjetoEscaperoom;
  ObjetosEscaperoom:ObjetoEscaperoom[] =[];
  ObjetoEscaperoomCambiado: ObjetoEscaperoom;

  nombreObjeto: string;
  tipoObjeto: string;
  imagenObjeto: string;
  imagenObjetoAntigua: string;
  selectedType: string;

  // imagen y archivo escena
  nombreImagenObjetoAntigua: string;
  nombreImagenObjetoNueva: string;
  fileImagenObjeto: File;

  // tslint:disable-next-line:ban-types
  imagenObjetoCargada: Boolean = false;

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;
  changed: Boolean = true;
  profesorId: number;



  constructor(
              public dialog: MatDialog,
              // private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditarObjetoDialogComponent>,
              private http: Http,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.profesorId =this.sesion.DameProfesor().id;
    this.ObjetosEscaperoom = this.sesion.DameObjetosEscaperoomProfesor();
    this.ObjetoEscaperoom = this.data.objeto;
    this.nombreObjeto = this.data.objeto.Nombre;
    this.nombreImagenObjetoNueva= this.data.objeto.Imagen;
    this.imagenObjetoAntigua = URL.ImagenesObjetos + this.nombreImagenObjetoNueva;  
  }
 /*
  ComprobarImagenesObjeto(comprobar: String, objId:number){
    
    return new Promise ((resolve, reject)=>{
      this.peticionesAPI.DameObjetosEscaperoomDelProfesor(this.profesorId).subscribe(data=>{
        
        var cont=0
        for(let i =0; i<data.length && cont<1;i++){
          if(data[i].id!=objId){
            if(comprobar==data[i].Imagen){
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
*/

  EditarObjeto() {
    /*
    this.ComprobarImagenesObjeto(this.nombreImagenObjetoNueva, this.ObjetoEscaperoom.id)
    .then(cont=>{
      if(cont==0){
        */
        var objeto=new ObjetoEscaperoom(this.nombreObjeto,  this.nombreImagenObjetoNueva);
        objeto.Publica=this.ObjetoEscaperoom.Publica;
        this.peticionesAPI.ModificaObjeto(objeto, this.ObjetoEscaperoom.id,this.profesorId)
        .subscribe((res) => {
          if (res != null) {
            this.ObjetoEscaperoom = res;
            if (this.imagenObjetoCargada === true) {
              var cont=0;
              for(let i=0; i<this.ObjetosEscaperoom.length; i++ ){
                if(this.ObjetosEscaperoom[i].Imagen ==this.nombreImagenObjetoAntigua){
                  cont++;
                }
              }
              if(cont==1){
                this.peticionesAPI.BorrarImagenObjeto(this.nombreImagenObjetoAntigua).subscribe();
              }          

              this.ObjetosEscaperoom.splice(this.ObjetosEscaperoom.findIndex(obj => obj.id == this.ObjetoEscaperoom.id), 1, this.ObjetoEscaperoom);
              const formData: FormData = new FormData();
              formData.append(this.nombreImagenObjetoNueva, this.fileImagenObjeto,this.nombreImagenObjetoNueva);
              this.peticionesAPI.PonImagenObjeto(formData)
              .subscribe(() => {});
              this.imagenObjetoAntigua=this.imagenObjeto;
              this.imagenObjetoCargada=false;
            }            
            Swal.fire("Editado","Objeto editado con éxito",'success');
            this.cambios = false;
            this.changed=true;
          } else {            
            Swal.fire("Error","No se ha podido editar el objeto",'error');
          }
        });
        /*
      }else if(cont>0){        
        Swal.fire("Error","Ya hay objetos con esta imagen",'error');
      }else{        
        Swal.fire("Error","Error en el servidor",'error');
      }
    })
    
    */
 }

ActivarInputImagenObjeto() {
    document.getElementById('inputObjetoImagen').click();
}

ExaminarImagenObjeto($event) {
  this.fileImagenObjeto = $event.target.files[0];


  const reader = new FileReader();
  reader.readAsDataURL(this.fileImagenObjeto);

  reader.onload = () => {
    var date = new Date();
    var timestamp= (date.getFullYear()).toString()+(date.getMonth()).toString()+(date.getDay()).toString()
      +(date.getHours()).toString()+(date.getMinutes()).toString()+(date.getSeconds()).toString()+(date.getMilliseconds()).toString();
      
    this.nombreImagenObjetoAntigua=this.nombreImagenObjetoNueva;
    this.nombreImagenObjetoNueva = timestamp+this.profesorId+this.fileImagenObjeto.name;
  
    this.imagenObjetoCargada= true;
    this.cambios=true;
    this.imagenObjeto = reader.result.toString();
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
    this.dialogRef.close(this.ObjetoEscaperoom);
    }else{
      
    this.dialogRef.close(null);
    }
  }
}

}
