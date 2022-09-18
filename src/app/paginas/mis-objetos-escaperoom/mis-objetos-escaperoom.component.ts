import { ObjetoActivo } from './../../clases/clasesParaJuegoDeEscapeRoom/ObjetoActivo';
import { MostrarObjetosPublicosComponent } from './mostrar-objetos-publicos/mostrar-objetos-publicos.component';
import { EditarObjetoDialogComponent } from './editar-objeto-dialog/editar-objeto-dialog.component';
import { ObjetoEscaperoom } from './../../clases/clasesParaJuegoDeEscapeRoom/ObjetoEscaperoom';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { EscenarioEscaperoom, EscenaEscaperoom, JuegoDeEscapeRoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mis-objetos-escaperoom',
  templateUrl: './mis-objetos-escaperoom.component.html',
  styleUrls: ['./mis-objetos-escaperoom.component.scss']
})
export class MisObjetosEscaperoomComponent implements OnInit {

  profesorId: number;
  ObjetoEscaperoom: ObjetoEscaperoom;
  ObjetosEscaperoom: ObjetoEscaperoom[]=[];
  ObjetosEscaperoomPublicos: ObjetoEscaperoom[]= [];
  imagenesObjetosEscaperoom: string[]=[];
  imagenesObjetosEscaperoomPublicos: string[]=[];

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

    this.TraeObjetosDelProfesor();
    this.DameTodosLosObjetosPublicos();
  }

  // Obtenemos todas las colecciones del profesor
  TraeObjetosDelProfesor() {

    this.peticionesAPI.DameObjetosEscaperoomDelProfesor(this.profesorId)
    .subscribe(objetos => {
      if (objetos[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.ObjetosEscaperoom = objetos;
        console.log(this.ObjetosEscaperoom);
        this.dataSource = new MatTableDataSource(this.ObjetosEscaperoom);
        this.sesion.TomaObjetosEscaperoomProfesor(this.ObjetosEscaperoom);
        this.TraeImagenesObjetos();
        // this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
      } else {
        this.ObjetosEscaperoom = undefined;
      }
    },(error)=>{

    });

  }


  DameTodosLosObjetosPublicos() {
    // traigo todos los publicos excepto los del profesor
    this.peticionesAPI.DameObjetosEscaperoomPublicos()
    .subscribe (res => {

      if (res[0] !== undefined) {
          this.ObjetosEscaperoomPublicos= res;
          this.dataSourcePublicas = new MatTableDataSource(this.ObjetosEscaperoomPublicos);
          for(let i=0; i<this.ObjetosEscaperoomPublicos.length; i++){
            this.imagenesObjetosEscaperoomPublicos[i]=this.ObjetosEscaperoomPublicos[i].Imagen;
          }
      }
    });


  }



Descargar(objetoEscaperoom: ObjetoEscaperoom) {

  this.sesion.TomaObjetoEscaperoom(objetoEscaperoom);
  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/guardarMapa']);

}


VerObjetoDialog(ObjetoEscaperoom: ObjetoEscaperoom) {

  this.sesion.TomaObjetoEscaperoom(ObjetoEscaperoom);

  const dialogRef = this.dialog.open(EditarObjetoDialogComponent, {
    width: '900px',
    maxHeight: '600px',
    // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
    data: {
      objeto: ObjetoEscaperoom,
    }
  });

   // RECUPERAREMOS LA NUEVA LISTA DE LOS CROMO Y VOLVEREMOS A BUSCAR LOS CROMOS QUE TIENE LA COLECCION
  dialogRef.afterClosed().subscribe(nuevoObjeto => {
    console.log ('objeto editado ' + nuevoObjeto);
    // tslint:disable-next-line:prefer-for-of
    if(nuevoObjeto!=null || nuevoObjeto!=undefined){
      var objetoBuscar = this.ObjetosEscaperoom.filter(obj => obj.id == nuevoObjeto.id)[0];
      var index = this.ObjetosEscaperoom.indexOf(objetoBuscar);
      this.ObjetosEscaperoom.splice(index, 1 ,nuevoObjeto);
      this.sesion.TomaObjetosEscaperoomProfesor;
      this.dataSource = new MatTableDataSource(this.ObjetosEscaperoom);
      //this.TraeImagenColeccion(this.coleccion);
      this.TraeImagenesObjetos();
    }

   });
  //abrir dialog
  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misObjetos']);

}


VerObjetoPublicoDialog(ObjetoEscaperoom: ObjetoEscaperoom) {

  this.sesion.TomaObjetoEscaperoom(ObjetoEscaperoom);
  const dialogRef = this.dialog.open(MostrarObjetosPublicosComponent, {
    width: '900px',
    maxHeight: '600px',
    // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
    data: {
      objeto: ObjetoEscaperoom,
    }
  });

  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/escenasPublicas']);

}

   // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
BorrarObjetoEscaperoom(objetoEscaperoom: ObjetoEscaperoom) {

    console.log ('Vamos a eliminar el objeto');
    this.peticionesAPI.BorrarObjetoEscaperoom(objetoEscaperoom.id).subscribe();

    var cont=0;
    for(let i=0; i<this.ObjetosEscaperoom.length && cont<2; i++ ){
      if(this.ObjetosEscaperoom[i].Imagen ==objetoEscaperoom.Imagen){
        cont++;
      }
    }
    if(cont<2){
      this.peticionesAPI.BorrarImagenObjeto(objetoEscaperoom.Imagen).subscribe();
    }          


    console.log ('La saco de la lista');
    this.ObjetosEscaperoom = this.ObjetosEscaperoom.filter(obj => obj.id !== objetoEscaperoom.id);
    this.sesion.TomaObjetosEscaperoomProfesor(this.ObjetosEscaperoom);
    this.dataSource = new MatTableDataSource(this.ObjetosEscaperoom);
}


  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarObjeto(objetoEscaperoom: ObjetoEscaperoom): void {
    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar el objeto?: " + objetoEscaperoom.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {

        //Antes de eliminar el juego tenemos que ver si hay algun juego activo
        this.peticionesAPI.DameObjetoActivoId(objetoEscaperoom.id).subscribe(res =>{

            if(res[0] !== undefined){
                  Swal.fire('Error', objetoEscaperoom.Nombre + 'Todavía hay alumnos usando el objeto en algun juego activo', 'error');
            }else{
              this.BorrarObjetoEscaperoom(objetoEscaperoom);
              Swal.fire('Eliminado', objetoEscaperoom.Nombre + ' eliminado correctamente', 'success');
            }
          },(error)=>{
          let errors: HttpErrorResponse = error;
          if (errors.status>=500){
            this.BorrarObjetoEscaperoom(objetoEscaperoom);
            Swal.fire('Eliminado', objetoEscaperoom.Nombre + ' eliminado correctamente', 'success');
          }else{
            Swal.fire('Error', objetoEscaperoom.Nombre + 'No se ha podido eliminar el objeto', 'error');
          }
        })
      }
  });
  }

  TraeImagenesObjetos(){
    for(let i=0; i<this.ObjetosEscaperoom.length; i++){
      this.imagenesObjetosEscaperoom[i]=this.ObjetosEscaperoom[i].Imagen;
    }
  }

  applyFilterProfesor(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterPublica(filterValue: string) {
    this.dataSourcePublicas.filter = filterValue.trim().toLowerCase();
  }

  Crear(){
    this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misObjetos/crearObjeto']);
  }

}
