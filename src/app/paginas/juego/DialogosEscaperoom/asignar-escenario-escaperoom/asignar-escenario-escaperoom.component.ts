import { EscenarioEscaperoom } from './../../../../clases/clasesParaJuegoDeEscapeRoom/EscenarioEscaperoom';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatTable, MatTableDataSource } from '@angular/material';
import { SesionService, PeticionesAPIService } from 'src/app/servicios';
import Swal from 'sweetalert2';
import'rxjs';
import { Location } from '@angular/common';
import { resolve } from 'url';

@Component({
  selector: 'app-asignar-escenario-escaperoom',
  templateUrl: './asignar-escenario-escaperoom.component.html',
  styleUrls: ['./asignar-escenario-escaperoom.component.scss']
})
export class AsignarEscenarioEscaperoomComponent implements OnInit {
  @Output() emisorEscenario = new EventEmitter <EscenarioEscaperoom>();

  
  displayedColumns: string[] = ['select', 'mapa', 'descripcion'];
  selection = new SelectionModel<EscenarioEscaperoom>(true, []);
  dataSourceMisEscenarios;
  misEscenarios: EscenarioEscaperoom[] = [];
  escenariosPublicos: EscenarioEscaperoom[]=[];

  profesorId: number;
  mensaje = 'Confirmar que quieres escoger el escenario: ';

  constructor(public dialog: MatDialog,
    private sesion: SesionService,
    public location: Location,
    private peticionesAPI: PeticionesAPIService
    ) { }

  ngOnInit() {
    this.profesorId = this.sesion.DameProfesor().id;
    this.DameEscenariosPublicosYDelProfesor();

  }

  DameEscenariosPublicosYDelProfesor() {
    var promisee= new Promise((resolve,reject)=>{
      this.peticionesAPI.DameEscenariosEscaperoomDelProfesor(this.profesorId)
      .subscribe ( res => {
        if (res[0] !== undefined) {
          this.misEscenarios = res;
          this.peticionesAPI.DameEscenariosEscaperoomPublicos()
          .subscribe ( res => {
            if (res[0] !== undefined) {
              this.escenariosPublicos = res;
              resolve('');
            } else {
              Swal.fire('Alerta', 'Aun no tiene ningun escenario', 'warning');
            }
          },error=>{
            
          });
        } else {
          Swal.fire('Alerta', 'Aun no tiene ningun escenario', 'warning');
        }
      },error=>{
        this.peticionesAPI.DameEscenariosEscaperoomPublicos()
        .subscribe ( res => {
          if (res[0] !== undefined) {
            this.escenariosPublicos = res;
            
            resolve('');
          } else {
            Swal.fire('Alerta', 'Aun no tiene ningun escenario', 'warning');
          }
        },error=>{
          reject('');
        });
      });
      
    })
    promisee.then(()=>{
      console.log("tengo escenarios", this.misEscenarios, this.escenariosPublicos);
      this.FiltrarEscenarios();
    })

  }

  FiltrarEscenarios(){
    if(this.misEscenarios!=undefined && this.escenariosPublicos!=undefined){
      for(let i=0; i<this.escenariosPublicos.length; i++){
        var found=false;
        for(let b=0; b<this.misEscenarios.length && !found; b++){
          if(this.escenariosPublicos[i].id==this.misEscenarios[b].id){
            found=true;
          }
          if(!found && b==this.misEscenarios.length-1){
            this.misEscenarios.push(this.escenariosPublicos[i]);
          }
        }
        if(i==this.escenariosPublicos.length-1){
          this.dataSourceMisEscenarios=new MatTableDataSource(this.misEscenarios);
        }
      }                 
    }else if(this.escenariosPublicos!=undefined && this.misEscenarios==undefined){
      this.dataSourceMisEscenarios=new MatTableDataSource(this.misEscenarios);
    }else if(this.escenariosPublicos==undefined && this.misEscenarios!=undefined){
      this.dataSourceMisEscenarios=new MatTableDataSource(this.escenariosPublicos);
    }else{
      Swal.fire('Alerta', 'Aun no existen escenarios públicos o privados', 'warning');
    }

  }
  
  HaSeleccionado() {
    if (this.selection.selected.length === 0) {
     return false;
    } else {
      return true;
    }
  }// cambiar por variable
  Marcar(row) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.clear();
      this.selection.select(row);
    }
  }

  AsignarEscenario() {
    let escenarioSeleccionado;
    this.dataSourceMisEscenarios.data.forEach ( row => {
      if (this.selection.isSelected(row)) {
        console.log ('hemos elegido ', row);
        escenarioSeleccionado = row;

      }
    });
    this.emisorEscenario.emit (escenarioSeleccionado);

  }

}

