import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Profesor } from 'src/app/clases/Profesor';
import { SesionService, PeticionesAPIService, CalculosService } from 'src/app/servicios';
import {Location} from '@angular/common';

@Component({
  selector: 'app-mis-escenarios-escaperoom',
  templateUrl: './mis-escenarios-escaperoom.component.html',
  styleUrls: ['./mis-escenarios-escaperoom.component.scss']
})
export class MisEscenariosEscaperoomComponent implements OnInit {

  constructor(private sesion: SesionService,
    private router: Router,
    private peticionesAPI: PeticionesAPIService,
    public dialog: MatDialog,
    private location: Location,
    private calculos: CalculosService) { }

    profesorId: number;

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;

    console.log(this.profesorId);
  }



  NavegarA(destino) {
    this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/' +destino]);
  }
}
