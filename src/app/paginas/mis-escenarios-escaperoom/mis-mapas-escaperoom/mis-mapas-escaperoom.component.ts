import { EscenaEscaperoom } from './../../../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { Escenario } from 'src/app/clases/Escenario';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { EscenarioEscaperoom, JuegoDeEscapeRoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-mapas-escaperoom',
  templateUrl: './mis-mapas-escaperoom.component.html',
  styleUrls: ['./mis-mapas-escaperoom.component.scss']
})
export class MisMapasEscaperoomComponent implements OnInit {
  profesorId: number;


  EscenariosProfesor: EscenarioEscaperoom[] = [];
  EscenariosPublicos: EscenarioEscaperoom[] = [];
  EscenasdeEscenario: EscenaEscaperoom[] = [];

  JuegoEscaperoom: JuegoDeEscapeRoom[] =[];
  numeroDeEscenarios: number;

  dataSource;
  dataSourcePublicas;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Estás seguro/a de que quieres eliminar el equipo llamado: ';
  displayedColumns: string[] = ['nombre', 'iconos'];
  //displayedColumns: string[] = ['nombre', 'edit', 'delete', 'copy', 'publica'];
  displayedColumnsPublica: string[] = ['nombre', 'iconos'];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    private http: Http
  ) { }

  ngOnInit() {

    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = this.sesion.DameProfesor().id;

    this.TraeEscenariosDelProfesor();
    this.DameTodasLosEscenariosPublicos();
  }

  // Obtenemos todas las colecciones del profesor
  TraeEscenariosDelProfesor() {

    this.peticionesAPI.DameEscenariosEscaperoomDelProfesor(this.profesorId)
    .subscribe(escenarios => {
      if (escenarios[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.EscenariosProfesor = escenarios;
        console.log(this.EscenariosProfesor);
        this.dataSource = new MatTableDataSource(this.EscenariosProfesor);
        // this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
      } else {
        this.EscenariosProfesor = undefined;
      }
    });
  }


  DameTodasLosEscenariosPublicos() {
    // traigo todos los publicos excepto los del profesor
    this.peticionesAPI.DameEscenariosEscaperoomPublicos()
    .subscribe (res => {

      if (res[0] !== undefined) {

          this.EscenariosPublicos= res;
          this.dataSourcePublicas = new MatTableDataSource(this.EscenariosPublicos);
        
      }
    });
  }



 Descargar(EscenarioEscaperoom: EscenarioEscaperoom) {

  this.sesion.TomaEscenarioEscaperoom(EscenarioEscaperoom);
  this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/guardarMapa']);

}


VerEscenas(EscenarioEscaperoom: EscenarioEscaperoom) {

  this.sesion.TomaEscenarioEscaperoom(EscenarioEscaperoom);
  this.peticionesAPI.DameEscenasdeEscenariosEscaperoom(EscenarioEscaperoom.id).subscribe(res =>{
      this.EscenasdeEscenario=res;
      this.sesion.TomaEscenasdeEscenario(this.EscenasdeEscenario);
  });
  this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/editarMapa']);

}


VerEscenasPublicas(EscenarioEscaperoom: EscenarioEscaperoom) {

  this.sesion.TomaEscenarioEscaperoom(EscenarioEscaperoom);
  this.peticionesAPI.DameEscenasdeEscenariosEscaperoom(EscenarioEscaperoom.id).subscribe(res =>{
      this.EscenasdeEscenario=res;
      this.sesion.TomaEscenasdeEscenario(this.EscenasdeEscenario);
  });
  this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/escenasPublicas']);

}

   // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
BorrarEscenarioEscaperoom(EscenarioEscaperoom: EscenarioEscaperoom) {

    console.log ('Vamos a eliminar el escenario');
    this.peticionesAPI.DameEscenasdeEscenariosEscaperoom(EscenarioEscaperoom.id).subscribe(res =>{
      if(res!== undefined){
        this.EscenasdeEscenario=res;
        for(let i = 0; i < (this.EscenasdeEscenario.length); i++) {
          this.peticionesAPI.BorrarEscenaEscaperoom(this.EscenasdeEscenario[i].id).subscribe();
          this.peticionesAPI.BorrarImagenEscena(this.EscenasdeEscenario[i].Tilesheet);
          this.peticionesAPI.BorrarArchivoEscena(this.EscenasdeEscenario[i].Archivo);
        }
        this.peticionesAPI.BorrarEscenarioEscaperoom(EscenarioEscaperoom.id).subscribe();
      }

    });

    console.log ('La saco de la lista');
    this.EscenariosProfesor = this.EscenariosProfesor.filter(escenario => escenario.id !== EscenarioEscaperoom.id);
    this.dataSource = new MatTableDataSource(this.EscenariosProfesor);
}


  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarEscenario(EscenarioEscaperoom: EscenarioEscaperoom): void {
    Swal.fire({
      title: 'Eliminar',
      text: "Las escenas asociadas a este escenario se eliminarán. Estas segura/o de que quieres eliminar el escenario?: " + EscenarioEscaperoom.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {

        //Antes de eliminar el juego tenemos que ver si hay algun juego activo
        this.peticionesAPI.DameJuegosEscaperoomdeEscenarioId(EscenarioEscaperoom.id).subscribe(res =>{

            this.JuegoEscaperoom=res;
            if(this.JuegoEscaperoom !== undefined){
              var cont =0;
              for (let i =0; i<this.JuegoEscaperoom.length; i++){
                if(this.JuegoEscaperoom[i].Terminado=true){
                  cont++;
                }
              }
              if(cont== this.JuegoEscaperoom.length){
                  this.BorrarEscenarioEscaperoom(EscenarioEscaperoom);
                  Swal.fire('Eliminado', EscenarioEscaperoom.Nombre + ' eliminado correctamente', 'success');
              }else{
                  Swal.fire('Error', EscenarioEscaperoom.Nombre + 'Todavía hay juegos activos usando este escenario', 'error');
              }

            }else{
              this.BorrarEscenarioEscaperoom(EscenarioEscaperoom);
              Swal.fire('Eliminado', EscenarioEscaperoom.Nombre + ' eliminado correctamente', 'success');
            }
        });
      }
    });
  }

  applyFilterProfesor(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterPublica(filterValue: string) {
    this.dataSourcePublicas.filter = filterValue.trim().toLowerCase();
  }

}
