import { MostrarSkinsPublicasComponent } from './mostrar-skins-publicas/mostrar-skins-publicas.component';
import { EditarSkinDialogComponent } from './editar-skin-dialog/editar-skin-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ObjetoEscaperoom, EscenarioEscaperoom, EscenaEscaperoom, JuegoDeEscapeRoom, Skin } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import { EditarObjetoDialogComponent } from '../mis-objetos-escaperoom/editar-objeto-dialog/editar-objeto-dialog.component';
import { MostrarObjetosPublicosComponent } from '../mis-objetos-escaperoom/mostrar-objetos-publicos/mostrar-objetos-publicos.component';
import 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mis-skins-escaperoom',
  templateUrl: './mis-skins-escaperoom.component.html',
  styleUrls: ['./mis-skins-escaperoom.component.scss']
})
export class MisSkinsEscaperoomComponent implements OnInit {

  profesorId: number;
  Skin: Skin;
  SkinsEscaperoom: Skin[]=[];
  SkinsEscaperoomPublicas: Skin[]= [];
  imagenesSkinsEscaperoom: string[]=[];
  imagenesSkinsEscaperoomPublicos: string[]=[];

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

    this.TraeSkinsDelProfesor();
    this.DameTodasLasSkinsPublicas();
  }

  // Obtenemos todas las colecciones del profesor
  TraeSkinsDelProfesor() {

    this.peticionesAPI.DameSkinsEscaperoomDelProfesor(this.profesorId)
    .subscribe(skins => {
      if (skins[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.SkinsEscaperoom = skins;
        console.log(this.SkinsEscaperoom);
        this.sesion.TomaSkisnEscaperoom(this.SkinsEscaperoom);
        this.dataSource = new MatTableDataSource(this.SkinsEscaperoom);
        // this.profesorService.EnviarProfesorIdAlServicio(this.profesorId);
      } else {
        this.SkinsEscaperoom = undefined;
      }
    });

    this.TraeImagenesSkins();
  }


  DameTodasLasSkinsPublicas() {
    // traigo todos los publicos excepto los del profesor
    this.peticionesAPI.DameSkinsEscaperoomPublicas()
    .subscribe (res => {

      if (res[0] !== undefined) {
          this.SkinsEscaperoomPublicas= res;
          this.dataSourcePublicas = new MatTableDataSource(this.SkinsEscaperoomPublicas);
      }
    });

    for(let i=0; i<this.SkinsEscaperoomPublicas.length; i++){
      this.imagenesSkinsEscaperoomPublicos[i]=this.SkinsEscaperoomPublicas[i].Spritesheet;
    }
  }



Descargar(skinEscaperoom: Skin) {

  this.sesion.TomaSkinEscaperoom(skinEscaperoom);
  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/guardarMapa']);

}

HazPublica(skinEscaperoom: Skin){
  skinEscaperoom.Publica = true;
  this.peticionesAPI.ModificaSkin(skinEscaperoom, skinEscaperoom.id, this.profesorId).subscribe(res=>{
    this.SkinsEscaperoomPublicas.push(res);
    this.SkinsEscaperoom.splice(this.SkinsEscaperoom.findIndex(sc=>sc.id==skinEscaperoom.id),1,res);  
    this.dataSourcePublicas = new MatTableDataSource(this.SkinsEscaperoomPublicas);
  });
}

HazPrivada(skinEscaperoom: Skin){
  skinEscaperoom.Publica = false;
  this.peticionesAPI.ModificaSkin(skinEscaperoom, skinEscaperoom.id, this.profesorId).subscribe(res=>{
    this.SkinsEscaperoomPublicas=this.SkinsEscaperoomPublicas.filter(sc=>sc.id!=res.id);
    this.SkinsEscaperoom.splice(this.SkinsEscaperoom.findIndex(sc=>sc.id==skinEscaperoom.id),1,res);
    this.dataSourcePublicas = new MatTableDataSource(this.SkinsEscaperoomPublicas);
  });
}

VerSkinDialog(SkinEscaperoom: Skin) {

  this.sesion.TomaSkinEscaperoom(SkinEscaperoom);

  const dialogRef = this.dialog.open(EditarSkinDialogComponent, {
    width: '900px',
    maxHeight: '600px',
    // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
    data: {
      skin: SkinEscaperoom,
    }
  });

   // RECUPERAREMOS LA NUEVA LISTA DE LOS CROMO Y VOLVEREMOS A BUSCAR LOS CROMOS QUE TIENE LA COLECCION
  dialogRef.afterClosed().subscribe(nuevaSkin => {
    
    console.log ('skin editado ' + nuevaSkin);
    if(nuevaSkin!=null){
      //tslint:disable-next-line:prefer-for-of
      
      this.SkinsEscaperoom.splice(this.SkinsEscaperoom.findIndex(sk=> sk.id== nuevaSkin.id),1,nuevaSkin);
      this.SkinsEscaperoomPublicas.splice(this.SkinsEscaperoom.findIndex(sk=> sk.id== nuevaSkin.id),1,nuevaSkin);
      this.dataSource = new MatTableDataSource(this.SkinsEscaperoom);
      this.dataSourcePublicas = new MatTableDataSource(this.SkinsEscaperoomPublicas);
      this.TraeImagenesSkins();
      this.sesion.TomaSkisnEscaperoom(this.SkinsEscaperoom);
    }
   });
  //abrir dialog
  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misObjetos']);

}


VerSkinPublicaDialog(skinEscaperoom: Skin) {

  this.sesion.TomaSkinEscaperoom(skinEscaperoom);
  const dialogRef = this.dialog.open(MostrarSkinsPublicasComponent, {
    width: '900px',
    maxHeight: '600px',
    // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
    data: {
      skin: skinEscaperoom,
    }
  });

  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/escenasPublicas']);

}

   // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
BorrarSkinEscaperoom(skinEscaperoom: Skin) {

    console.log ('Vamos a eliminar la skin');
    this.peticionesAPI.BorrarSkinEscaperoom(skinEscaperoom.id).subscribe();

    var cont=0;
    for(let i=0; i<this.SkinsEscaperoom.length && cont<2; i++ ){
      if(this.SkinsEscaperoom[i].Spritesheet ==skinEscaperoom.Spritesheet){
        cont++;
      }
    }
    if(cont<2){
      this.peticionesAPI.BorrarImagenSkin(skinEscaperoom.Spritesheet).subscribe();
    }          


    console.log ('La saco de la lista');
    this.SkinsEscaperoom = this.SkinsEscaperoom.filter(sk => sk.id !== skinEscaperoom.id);
    this.SkinsEscaperoomPublicas = this.SkinsEscaperoomPublicas.filter(sk => sk.id !== skinEscaperoom.id);
    this.sesion.TomaSkisnEscaperoom(this.SkinsEscaperoom);
    this.dataSource = new MatTableDataSource(this.SkinsEscaperoom);
    this.dataSourcePublicas = new MatTableDataSource(this.SkinsEscaperoomPublicas);
}


  // Si queremos borrar un equipo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarSkin(skinEscaperoom: Skin): void {
    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar la skin?: " + skinEscaperoom.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {

        //Antes de eliminar el juego tenemos que ver si hay algun juego activo
        this.peticionesAPI.DameSkinActivaId(skinEscaperoom.id).subscribe(res =>{

            if(res !== undefined){
                  Swal.fire('Error', skinEscaperoom.Nombre + 'Todavía hay alumnos usando la skin en algun juego activo', 'error');
            }else{
              this.BorrarSkinEscaperoom(skinEscaperoom);
              Swal.fire('Eliminado', skinEscaperoom.Nombre + ' eliminado correctamente', 'success');
            }
        },(error)=>{
          let errors: HttpErrorResponse = error;
          if (errors.status>=500){
            this.BorrarSkinEscaperoom(skinEscaperoom);
            Swal.fire('Eliminado', skinEscaperoom.Nombre + ' eliminado correctamente', 'success');
          }else{
            Swal.fire('Error', skinEscaperoom.Nombre + 'No se ha podido eliminar la skin', 'error');
          }          
          Swal.fire('Eliminado', skinEscaperoom.Nombre + ' eliminada correctamente', 'success');
        });
      }
    });
  }

  TraeImagenesSkins(){
    for(let i=0; i<this.SkinsEscaperoom.length; i++){
      
      this.imagenesSkinsEscaperoom[i]=this.SkinsEscaperoom[i].Spritesheet;

    }

  }

  applyFilterProfesor(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterPublica(filterValue: string) {
    this.dataSourcePublicas.filter = filterValue.trim().toLowerCase();
  }

  Crear(){
    this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misSkins/crearSkin']);
  }
}
