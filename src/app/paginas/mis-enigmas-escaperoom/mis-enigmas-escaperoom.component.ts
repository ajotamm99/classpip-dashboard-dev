import { MostrarEnigmasPublicosComponent } from './mostrar-enigmas-publicos/mostrar-enigmas-publicos.component';
import { EditarEnigmasDialogComponent } from './editar-enigmas-dialog/editar-enigmas-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Enigma, Skin } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { EditarSkinDialogComponent } from '../mis-skins-escaperoom/editar-skin-dialog/editar-skin-dialog.component';
import { MostrarSkinsPublicasComponent } from '../mis-skins-escaperoom/mostrar-skins-publicas/mostrar-skins-publicas.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mis-enigmas-escaperoom',
  templateUrl: './mis-enigmas-escaperoom.component.html',
  styleUrls: ['./mis-enigmas-escaperoom.component.scss']
})
export class MisEnigmasEscaperoomComponent implements OnInit {

  profesorId: number;
  Enigma: Enigma;
  EnigmasEscaperoom: Enigma[]=[];
  EnigmasEscaperoomPublicas: Enigma[]= [];
  imagenesEnigmasEscaperoom: string[]=[];
  imagenesEnigmasEscaperoomPublicos: string[]=[];

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

    this.TraeEnigmasDelProfesor();
    this.DameTodosLosEnigmasPublicos();
  }

  // Obtenemos todas las colecciones del profesor
  TraeEnigmasDelProfesor() {

    this.peticionesAPI.DameEnigmasEscaperoomDelProfesor(this.profesorId)
    .subscribe(enigmas => {
      if (enigmas[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.EnigmasEscaperoom = enigmas;
        console.log(this.EnigmasEscaperoom);
        this.dataSource = new MatTableDataSource(this.EnigmasEscaperoom);
        // this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
      } else {
        this.EnigmasEscaperoom = undefined;
      }
    });

  }


  DameTodosLosEnigmasPublicos() {
    // traigo todos los publicos excepto los del profesor
    this.peticionesAPI.DameEnigmasEscaperoomPublicos()
    .subscribe (res => {

      if (res[0] !== undefined) {
          this.EnigmasEscaperoomPublicas= res;
          this.dataSourcePublicas = new MatTableDataSource(this.EnigmasEscaperoomPublicas);
      }
    });

  }



Descargar(enigmaEscaperoom: Enigma) {

  this.sesion.TomaEnigmaEscaperoom(enigmaEscaperoom);
  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/guardarMapa']);

}


VerEnigmaDialog(enigmaEscaperoom: Enigma) {

  this.sesion.TomaEnigmaEscaperoom(enigmaEscaperoom);

  const dialogRef = this.dialog.open(EditarEnigmasDialogComponent, {
    width: '900px',
    maxHeight: '600px',
    // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
    data: {
      enigma: enigmaEscaperoom,
    }
  });

   // RECUPERAREMOS LA NUEVA LISTA DE LOS CROMO Y VOLVEREMOS A BUSCAR LOS CROMOS QUE TIENE LA COLECCION
  dialogRef.afterClosed().subscribe(nuevoEnigma => {
    if(nuevoEnigma!=null){
      console.log ('enigma editado ' + nuevoEnigma);
      // tslint:disable-next-line:prefer-for-of
      //var searchEnigma= this.EnigmasEscaperoom.find(en=> en.id == nuevoEnigma.id)[0];
      //var index = this.EnigmasEscaperoom.indexOf(searchEnigma);
      this.EnigmasEscaperoom.splice(this.EnigmasEscaperoom.findIndex(en=> en.id == nuevoEnigma.id),1,nuevoEnigma);
      //this.EnigmasEscaperoom.push (nuevoEnigma);
      this.dataSource=new MatTableDataSource(this.EnigmasEscaperoom);
    }


   });
  //abrir dialog
  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misObjetos']);

}


VerEnigmaPublicoDialog(enigmaEscaperoom: Enigma) {

  this.sesion.TomaEnigmaEscaperoom(enigmaEscaperoom);
  const dialogRef = this.dialog.open(MostrarEnigmasPublicosComponent, {
    width: '900px',
    maxHeight: '600px',
    // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
    data: {
      enigma: enigmaEscaperoom,
    }
  });

  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/escenasPublicas']);

}

   // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
BorrarEnigmaEscaperoom(enigmaEscaperoom: Enigma) {

    console.log ('Vamos a eliminar el enigma');
    this.peticionesAPI.BorrarEnigmaEscaperoom(enigmaEscaperoom.id).subscribe();

    console.log ('La saco de la lista');
    this.EnigmasEscaperoom = this.EnigmasEscaperoom.filter(en => en.id !== enigmaEscaperoom.id);
    this.dataSource = new MatTableDataSource(this.EnigmasEscaperoom);
}


  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarEnigma(enigmaEscaperoom: Enigma): void {
    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar la skin?: " + enigmaEscaperoom.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {

        //Antes de eliminar el juego tenemos que ver si hay algun juego activo
        this.peticionesAPI.DameEnigmaActivoId(enigmaEscaperoom.id).subscribe(res =>{

            if(res !== undefined){
                  Swal.fire('Error', enigmaEscaperoom.Nombre + 'Todavía hay alumnos usando el enigma en algun juego activo', 'error');
            }else{
              this.BorrarEnigmaEscaperoom(enigmaEscaperoom);
              Swal.fire('Eliminado', enigmaEscaperoom.Nombre + ' eliminado correctamente', 'success');
            }
        }, (error)=>{
          let errors: HttpErrorResponse = error;
          if (errors.status>=500){
            this.BorrarEnigmaEscaperoom(enigmaEscaperoom);
            Swal.fire('Eliminado', enigmaEscaperoom.Nombre + ' eliminado correctamente', 'success');
          }else{
            Swal.fire('Error', enigmaEscaperoom.Nombre + 'No se ha podido eliminar el enigma', 'error');
          }
    
        });
      }
    })
  }


  applyFilterProfesor(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterPublica(filterValue: string) {
    this.dataSourcePublicas.filter = filterValue.trim().toLowerCase();
  }

  Crear(){
    this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misEnigmas/crearEnigma']);
  }

}
