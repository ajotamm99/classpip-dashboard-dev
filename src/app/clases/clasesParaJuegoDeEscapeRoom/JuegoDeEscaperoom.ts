export class JuegoDeEscapeRoom {

    id: number;
    escenarioId: number;
    grupoId: number;
    TiempoLimite: number;
    Nombre:string;
    Activo: boolean;
    Tipo: string;
    Modo: string;
    Online: boolean;
    Terminado:boolean;

    constructor(id?: number, escenarioId?: number, grupoId?:number, TiempoLimite?: number, Nombre?: string, Tipo?: string, Modo?: string, Online?: boolean, Activo?:boolean){
        this.Terminado =false; 
        this.id =id;
        this.escenarioId =escenarioId;
        this.grupoId=grupoId;
        this.TiempoLimite=TiempoLimite;
        this.Nombre= Nombre;
        this.Tipo =Tipo;
        this.Modo =Modo;
        this.Online=Online;
        this.Activo =Activo;
    }

  }