import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Enigma, Skin } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { MostrarSkinsPublicasComponent } from '../../mis-skins-escaperoom/mostrar-skins-publicas/mostrar-skins-publicas.component';

@Component({
  selector: 'app-mostrar-enigmas-publicos',
  templateUrl: './mostrar-enigmas-publicos.component.html',
  styleUrls: ['./mostrar-enigmas-publicos.component.scss']
})
export class MostrarEnigmasPublicosComponent implements OnInit {
  EnigmaEscaperoom: Enigma;

  nombreEnigma: string;
  tipoEnigma: string;
  dificultadEnigma: string;


  // imagen y archivo escena



  constructor(
              public dialog: MatDialog,
              // private location: Location,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<MostrarEnigmasPublicosComponent>,
              private http: Http,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.EnigmaEscaperoom = this.data.enigma;
    this.nombreEnigma = this.data.enigma.Nombre;
    this.tipoEnigma= this.data.enigma.Tipo;
    this.dificultadEnigma=this.data.enigma.Dificultad;
    console.log(this.EnigmaEscaperoom);
  }

Cerrar(): void {
  this.dialogRef.close();
}

}
