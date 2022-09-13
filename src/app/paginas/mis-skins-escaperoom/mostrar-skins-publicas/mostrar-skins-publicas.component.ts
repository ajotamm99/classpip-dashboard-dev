import { ImagenesSkins } from './../../../URLs/urls';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ObjetoEscaperoom, Skin } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { MostrarObjetosPublicosComponent } from '../../mis-objetos-escaperoom/mostrar-objetos-publicos/mostrar-objetos-publicos.component';
import 'rxjs';
import * as URL from '../../../URLs/urls';
@Component({
  selector: 'app-mostrar-skins-publicas',
  templateUrl: './mostrar-skins-publicas.component.html',
  styleUrls: ['./mostrar-skins-publicas.component.scss']
})
export class MostrarSkinsPublicasComponent implements OnInit {
  SkinEscaperoom: Skin;

  nombreSkin: string;
  imagenSkin: string;


  // imagen y archivo escena
  nombreImagenSkin: string;



  constructor(
              public dialog: MatDialog,
              // private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<MostrarSkinsPublicasComponent>,
              private http: Http,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.SkinEscaperoom = this.data.skin;
    this.nombreSkin = this.data.skin.Nombre;
    this.nombreImagenSkin= this.data.skin.Spritesheet;
    this.imagenSkin=URL.ImagenesSkins + this.nombreImagenSkin;
    console.log(this.SkinEscaperoom);
  }

Cerrar(): void {
  this.dialogRef.close();
}

}
