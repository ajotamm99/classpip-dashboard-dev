export class JuegoDeEscapeRoom {

    id: number;
    escenarioEscaperoomId: number;
    grupoId: number;
    TiempoLimite: number;
    Nombre:string;
    Activo: boolean;
    Tipo: string;
    Modo: string;
    Online: boolean;
    Terminado:boolean;

    constructor(id?: number, escenarioEscaperoomId?: number, grupoId?:number, TiempoLimite?: number, Nombre?: string, Tipo?: string, Modo?: string, Online?: boolean, Activo?:boolean){
        this.Terminado =false; 
        this.id =id;
        this.escenarioEscaperoomId =escenarioEscaperoomId;
        this.grupoId=grupoId;
        this.TiempoLimite=TiempoLimite;
        this.Nombre= Nombre;
        this.Tipo =Tipo;
        this.Modo =Modo;
        this.Online=Online;
        this.Activo =Activo;
    }

  }