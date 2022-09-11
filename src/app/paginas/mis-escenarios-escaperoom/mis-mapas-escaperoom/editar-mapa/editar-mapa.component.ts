import { EditarEscenaDialogComponent } from './../editar-escena-dialog/editar-escena-dialog.component';
import { ArchivosEscenas } from './../../../../URLs/urls';
import { AgregarEscenaDialogComponent } from './../agregar-escena-dialog/agregar-escena-dialog.component';
import { EscenaEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { EscenarioEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenarioEscaperoom';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MatDialog } from '@angular/material';
import { Coleccion, Cromo, Escenario } from 'src/app/clases';
import { DialogoConfirmacionComponent } from 'src/app/paginas/COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { AgregarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/agregar-cromo-dialog/agregar-cromo-dialog.component';
import { EditarCromoDialogComponent } from 'src/app/paginas/mis-colecciones/editar-cromo-dialog/editar-cromo-dialog.component';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';

import 'rxjs';
import { Location } from '@angular/common';

import * as URL from '../../../../URLs/urls';

@Component({
  selector: 'app-editar-mapa',
  templateUrl: './editar-mapa.component.html',
  styleUrls: ['./editar-mapa.component.scss']
})
export class EditarMapaComponent implements OnInit {


  EscenaEscaperoom: EscenaEscaperoom;
  imagenesEscenas: string[] = [];
  archivosEscenas: string[] = [];

  nombreEscenario: string;
  descripcionEscenario: string;
  // imagen coleccion
  imagenColeccion: string;
  nombreImagenColeccion: string;
  file: File;

  // tslint:disable-next-line:ban-types
  imagenCambiada: Boolean = false;

  // PARA DIÁLOGO DE CONFIRMACIÓN
  // tslint:disable-next-line:no-inferrable-types
  mensaje: string = 'Confirma que quieres eliminar el equipo llamado: ';

  // tslint:disable-next-line:ban-types
  cambios: Boolean = false;
  // tslint:disable-next-line:ban-types
  voltear: Boolean = false;
  // tslint:disable-next-line:ban-types
  mostrarTextoGuardar: Boolean = false;

  interval;
  EscenarioEscaperoom: EscenarioEscaperoom;
  EscenasdeEscenario: EscenaEscaperoom[];

  escenasAgregadas: EscenaEscaperoom[] = [];
  constructor(
              public dialog: MatDialog,
              private location: Location,
              private http: Http,
              private sesion: SesionService,
              private peticionesAPI: PeticionesAPIService
  ) { }

  ngOnInit() {
    this.EscenarioEscaperoom = this.sesion.DameEscenarioEscaperoom();
    this.EscenasdeEscenario = this.sesion.DameEscenasdeEscenario();
    this.nombreEscenario = this.EscenarioEscaperoom.Nombre;
    this.descripcionEscenario = this.EscenarioEscaperoom.Descripcion;
    console.log ('escenas');
    console.log (this.EscenasdeEscenario);
    // Me traigo la imagen de la colección y las imagenes de cada cromo
    // this.TraeImagenColeccion(this.coleccion);
    // Cargo el imagen de la coleccion
    // this.GET_Imagen();
  }

  // Se hace un PUT de la coleccion seleccionada para editar
  EditarEscenario() {
    console.log('Entro a editar');
    // Borramos la imagen anterior

    /*/if (this.coleccion.ImagenColeccion !== undefined) {
      this.peticionesAPI.BorrarImagenColeccion (this.coleccion.ImagenColeccion).subscribe();
    }*/

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.ModificaEscenarioEscaperoom(new EscenarioEscaperoom(this.EscenarioEscaperoom.profesorId, this.nombreEscenario, this.descripcionEscenario), this.EscenarioEscaperoom.profesorId, this.EscenarioEscaperoom.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar el escenario con id ' + this.EscenarioEscaperoom.id);
        this.EscenarioEscaperoom = res;

      } else {
        console.log('fallo editando');
      }
    });
    this.cambios = false;

  }

  // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo


  // AL CLICAR EN AGREGAR LOGO NOS ACTIVARÁ LA FUNCIÓN MOSTRAR DE ABAJO
  /*ActivarInput() {
    console.log('Activar input');
    document.getElementById('input').click();
  }


   // Seleccionamos una foto y guarda el nombre de la foto en la variable logo
  Mostrar($event) {
    this.file = $event.target.files[0];

    console.log('fichero ' + this.file.name);
    this.nombreImagenColeccion = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      console.log('ya');
      this.cambios = true;
      this.imagenCambiada = true;
      this.imagenColeccion = reader.result.toString();
    };
  }
*/


  // SI QUEREMOS AÑADIR CROMOS MANUALMENTE LO HAREMOS EN UN DIALOGO
  AbrirDialogoAgregarEscenaEscenario(): void {
    const dialogRef = this.dialog.open(AgregarEscenaDialogComponent, {
      width: '900px',
      maxHeight: '600px',
      // Le pasamos solo los id del grupo y profesor ya que es lo único que hace falta para vincular los alumnos
      data: {
        escenario: this.EscenarioEscaperoom,
      }
    });

     // RECUPERAREMOS LA NUEVA LISTA DE LOS CROMO Y VOLVEREMOS A BUSCAR LOS CROMOS QUE TIENE LA COLECCION
    dialogRef.afterClosed().subscribe(escenasAgregadas => {
      console.log ('volvemos de agregar cromos ' + escenasAgregadas.length);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0 ; i < escenasAgregadas.length; i++) {
        this.EscenasdeEscenario.push (escenasAgregadas[i]);
      }
      //this.TraeImagenColeccion(this.coleccion);
      this.TraeArchivosEscenas();

     });
  }

  TraeArchivosEscenas() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.EscenasdeEscenario.length; i++) {

      this.EscenaEscaperoom = this.EscenasdeEscenario[i];
      this.imagenesEscenas[i] = URL.ImagenesEscenas + this.EscenaEscaperoom.Tilesheet;
      this.archivosEscenas[i] = URL.ArchivosEscenas + this.EscenaEscaperoom.Archivo;

    }
    //por si quiero ordenar:
    //this.EscenasdeEscenario.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }

  // TAMBIEN EDITAREMOS EL CROMO EN UN DIALOGO
  AbrirDialogoEditarCromo(escena: EscenaEscaperoom): void {

    const dialogRef = this.dialog.open ( EditarEscenaDialogComponent , {
      width: '900px',
      maxHeight: '600px',
      data: {
        escena: escena,
        escenario: this.EscenarioEscaperoom,
      }
    });

    // tslint:disable-next-line:no-shadowed-variable
    dialogRef.afterClosed().subscribe( escena => {
      // console.log ('volvemos de editar cromos ' + cromosEditados.length);
      // tslint:disable-next-line:prefer-for-of
      this.EscenasdeEscenario = this.EscenasdeEscenario.filter(escen => escen.id !== escena.id);
      this.EscenasdeEscenario.push (escena);
      // this.cromosColeccion = this.sesion.DameCromos();
      // this.coleccion = this.sesion.DameColeccion();
      //this.TraeImagenColeccion(this.coleccion);
      this.TraeArchivosEscenas();

    });
  }

  // Guardo cromo en sesión, porque lo necesitará el componente de editar cromo
  GuardarEscena(escena: EscenaEscaperoom) {
    console.log('voy a enviar');
    this.sesion.TomaEscenaEscaperoom(this.EscenaEscaperoom);
  }

  // Si queremos borrar un cromo, antes nos saldrá un aviso para confirmar la acción como medida de seguridad. Esto se
  // hará mediante un diálogo al cual pasaremos el mensaje y el nombre del equipo
  AbrirDialogoConfirmacionBorrarCromo(escena: EscenaEscaperoom): void {
    Swal.fire({
      title: 'Eliminar',
      text: "Estas segura/o de que quieres eliminar la escena llamada: " +escena.Nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.value) {
        this.BorrarEscena(escena);
        Swal.fire('Eliminado', 'Escena: ' + escena.Nombre + ' eliminada correctamente', 'success');

      };
    })

  }

  // Utilizamos esta función para eliminar un cromo de la base de datos y actualiza la lista de cromos
  BorrarEscena(escena: EscenaEscaperoom) {
    const posicion = this.EscenasdeEscenario.indexOf (escena);
    console.log ('voy a borrar la escena ' + escena.id +  ' de la posición ' + posicion);

    this.peticionesAPI.BorrarEscenaEscaperoom (escena.id).subscribe( () => {
       // usar splice? this.EscenasdeEscenario.splice
        this.EscenasdeEscenario.splice(posicion,1);
        //const nueva = this.EscenasdeEscenario.slice(0, posicion).concat(this.EscenasdeEscenario.slice(posicion + 1, this.EscenasdeEscenario.length))
        //this.EscenasdeEscenario = nueva;
        console.log ('ya esta borrado');
        console.log (this.EscenasdeEscenario);
      }
    );
    console.log (this.EscenasdeEscenario);
    this.peticionesAPI.BorrarImagenEscena(escena.Tilesheet).subscribe( () => {
        // tslint:disable-next-line:max-line-length
        //const nueva = this.imagenesCromosDelante.slice(0, posicion).concat(this.imagenesCromosDelante.slice(posicion + 1, this.imagenesCromosDelante.length));
        //this.imagenesEscenas =nueva;
        this.imagenesEscenas.splice(posicion,1);
      }
    );
      this.peticionesAPI.BorrarArchivoEscena(escena.Archivo).subscribe( () => {
        // tslint:disable-next-line:max-line-length
        //const nueva = this.ArchivosEscenas.slice(0, posicion).concat(this.imagenesCromosDetras.slice(posicion + 1, this.imagenesCromosDetras.length));
        //this.archivosEscenas =nueva;
        this.archivosEscenas.splice(posicion,1);
      }
      );
    



  }


  goBack() {
    if (this.cambios) {
      const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
        height: '150px',
        data: {
          mensaje: 'Dale a Aceptar si no quieres que se hagan los cambios en el nombre o en la descripcion del escenario'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }

}
