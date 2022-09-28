import { EscenaBase64 } from '../../../clases/clasesParaJuegoDeEscapeRoom/EscenaBase64';
import { data } from 'jquery';
import { TrustedString } from '@angular/core/src/sanitization/bypass';
import { HttpErrorResponse } from '@angular/common/http';
import { EscenaEscaperoom } from './../../../clases/clasesParaJuegoDeEscapeRoom/EscenaEscaperoom';
import { Escenario } from 'src/app/clases/Escenario';
import { Component, OnInit, Type } from '@angular/core';
import { Http } from '@angular/http';
import { ErrorStateMatcher, MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { EscenarioEscaperoom, JuegoDeEscapeRoom } from 'src/app/clases';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import 'rxjs';
import * as JSZip from 'jszip';
import * as saveAs from 'file-saver';

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
  EscenasBase64: EscenaBase64[]=[];

  JuegoEscaperoom: JuegoDeEscapeRoom | JuegoDeEscapeRoom[];
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
  var lista: string [] = [];

  //this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/guardarMapa']);
  var zip= new JSZip();
  this.peticionesAPI.DameEscenasdeEscenariosEscaperoom(EscenarioEscaperoom.id)
  .subscribe(res=>{
    this.ImagenesArchivosAsync(res)
    .then(_=>{
      console.log(this.EscenasBase64);
      var cont=0;
      for(let i=0; i<this.EscenasBase64.length;i++){   
        var fld=zip.folder(this.EscenasBase64[i].Nombre);     
        fld.file(this.EscenasBase64[i].Nombre+".png",this.EscenasBase64[i].Imagen64, {base64: true});
        fld.file(this.EscenasBase64[i].Nombre+".json",this.EscenasBase64[i].Archivo64, {base64: true});
        cont++;
        if(cont==this.EscenasBase64.length){
          zip.generateAsync({type:"blob"})
          .then(function(content) {
          // see FileSaver.js
          saveAs(content, EscenarioEscaperoom.Nombre+".zip");
          });    
        }   
      }      
    });
  },error=>{
    Swal.fire("Error","No hay escenas en el escenario",'error');
  })

}

async ImagenesArchivosAsync(escenasEscaperoom: EscenaEscaperoom[]){
  await new Promise<void>(async (resolve, _) => {
    var cont=0;
    for(let i=0; i<escenasEscaperoom.length; i++){
      this.peticionesAPI.DameImagenEscena(escenasEscaperoom[i].Tilesheet)
      .subscribe( res=>{
        const blob1 = new Blob([res.blob()], { type: 'image/jpg'});
        this.blobToBase64(blob1)
        .then(data1=>{
          this.EscenasBase64[i]=(new EscenaBase64(escenasEscaperoom[i].Nombre,data1));
          this.peticionesAPI.DameArchivoEscena(escenasEscaperoom[i].Archivo)
          .subscribe( res=>{
            const blob2 = new Blob([res.blob()], { type: 'application/json'});
            this.blobToBase64(blob2)
            .then(data2=>{
              this.EscenasBase64[i].Archivo64=data2;
              cont++;
              if(cont==escenasEscaperoom.length){
                resolve();
              }
            })        
          });
        })        
      });
    }
  });
}

blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, _) => {
    const reader = new FileReader();    
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result.toString().split(',')[1]);
    };
  });
}

HazPublico(escenarioEscaperoom: EscenarioEscaperoom){
  escenarioEscaperoom.Publica = true;
  this.peticionesAPI.ModificaEscenarioEscaperoom(escenarioEscaperoom, this.profesorId, escenarioEscaperoom.id).subscribe(res=>{
    this.EscenariosPublicos.push(res);
    this.EscenariosProfesor.splice(this.EscenariosProfesor.findIndex(sc=>sc.id==escenarioEscaperoom.id),1,res);  
    this.dataSourcePublicas = new MatTableDataSource(this.EscenariosPublicos);
  });
}

HazPrivado(escenarioEscaperoom: EscenarioEscaperoom){
  escenarioEscaperoom.Publica = false;
  this.peticionesAPI.ModificaEscenarioEscaperoom(escenarioEscaperoom, this.profesorId, escenarioEscaperoom.id).subscribe(res=>{
    this.EscenariosPublicos=this.EscenariosPublicos.filter(sc=>sc.id!=res.id);
    this.EscenariosProfesor.splice(this.EscenariosProfesor.findIndex(sc=>sc.id==escenarioEscaperoom.id),1,res);
    this.dataSourcePublicas = new MatTableDataSource(this.EscenariosPublicos);
  });
}

Crear(){
  this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/crearMapa']);

}



VerEscenas(EscenarioEscaperoom: EscenarioEscaperoom) {

  this.sesion.TomaEscenarioEscaperoom(EscenarioEscaperoom);
  this.peticionesAPI.DameEscenasdeEscenariosEscaperoom(EscenarioEscaperoom.id).subscribe(res =>{
      this.EscenasdeEscenario=res;
      this.sesion.TomaEscenasdeEscenario(this.EscenasdeEscenario);
      this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/editarMapa']);

  }, (error) =>{
    console.log("no hay ninguna escena en el escenario", error);
    let errors: HttpErrorResponse = error;
    if (errors.status>=500){
      //Swal.fire('Escenas', 'No hay ninguna escena en el escenario: '+EscenarioEscaperoom.Nombre, 'warning');
    }    
    this.sesion.TomaEscenasdeEscenario(this.EscenasdeEscenario);
    this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/editarMapa']);

  });
  
}


VerEscenasPublicas(EscenarioEscaperoom: EscenarioEscaperoom) {

  this.sesion.TomaEscenarioEscaperoom(EscenarioEscaperoom);
  this.peticionesAPI.DameEscenasdeEscenariosEscaperoom(EscenarioEscaperoom.id).subscribe(res =>{
      this.EscenasdeEscenario=res;
      this.sesion.TomaEscenasdeEscenario(this.EscenasdeEscenario);
      this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/escenasPublicas']);
  }, (error) =>{
    console.log("no hay ninguna escena en el escenario", error);
    let errors: HttpErrorResponse = error;
    if (errors.status>=500){
      //Swal.fire('Escenas', 'No hay ninguna escena en el escenario: '+EscenarioEscaperoom.Nombre, 'warning');
    }    
    this.sesion.TomaEscenasdeEscenario(this.EscenasdeEscenario);
    this.router.navigate(['/inicio/' + this.profesorId + '/recursos/misRecursosEscaperoom/misMapas/escenasPublicas']);
  });
  
}

   // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
BorrarEscenarioEscaperoom(EscenarioEscaperoom: EscenarioEscaperoom) {

    console.log ('Vamos a eliminar el escenario');
    this.peticionesAPI.DameEscenasdeEscenariosEscaperoom(EscenarioEscaperoom.id).subscribe(res =>{
      console.log(res);      
      this.EscenasdeEscenario=res;
      this.peticionesAPI.DameEscenasEscaperoom().subscribe(escenas =>{
        var escenas = escenas;
        for(let i = 0; i < (this.EscenasdeEscenario.length); i++) {
          this.peticionesAPI.BorrarEscenaEscaperoom(this.EscenasdeEscenario[i].id).subscribe(_=>{
            this.peticionesAPI.BorrarImagenEscena(this.EscenasdeEscenario[i].Tilesheet).subscribe();
            this.peticionesAPI.BorrarArchivoEscena(this.EscenasdeEscenario[i].Archivo).subscribe();
        });
        
        }
        this.peticionesAPI.BorrarEscenarioEscaperoom(EscenarioEscaperoom.id).subscribe();
      });



    }, (error) =>{
      console.log("no hay ninguna escena en el escenario", error);
      let errors: HttpErrorResponse = error;
      if (errors.status>=500){
        this.peticionesAPI.BorrarEscenarioEscaperoom(EscenarioEscaperoom.id).subscribe();
        Swal.fire('Eliminado', EscenarioEscaperoom.Nombre + 'No hay ninguna escena en el escenario, eliminado correctamente', 'success');
    }
    });

    console.log ('La saco de la lista');
    this.EscenariosProfesor = this.EscenariosProfesor.filter(escenario => escenario.id !== EscenarioEscaperoom.id);
    this.EscenariosPublicos=this.EscenariosPublicos.filter(escenario => escenario.id !== EscenarioEscaperoom.id);
    this.dataSource = new MatTableDataSource(this.EscenariosProfesor);
    this.dataSourcePublicas = new MatTableDataSource(this.EscenariosPublicos);
    //this.ngOnInit();
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
        
        //Antes de eliminar el escenario tenemos que ver si hay algun juego activo
        this.peticionesAPI.DameJuegosEscaperoomdeEscenarioId(EscenarioEscaperoom.id).subscribe((res)=>{
            console.log("Hemos llegado", res);
            
              this.JuegoEscaperoom=res;
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

          }, (error) =>{
            console.log("no hay ningun juego activo", error);
            let errors: HttpErrorResponse = error;
            if (errors.status>=500){
              this.BorrarEscenarioEscaperoom(EscenarioEscaperoom);
              Swal.fire('Eliminado', 'No hay ningún juego activo con este escenario, eliminado correctamente', 'success');
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
