export class EscenaActiva {

    id: number;
    orden: number;
    escenarioEscaperoomId: number;
    escenaEscaperoomId: number;
    juegoDeEscaperoomId: number;
  
    constructor(escenarioEscaperoomId?: number, escenaEscaperoomId?: number, juegoDeEscaperoomId?: number, orden?: number) {
  
      this.escenarioEscaperoomId = escenarioEscaperoomId 
      this.escenaEscaperoomId = escenaEscaperoomId;
      this.juegoDeEscaperoomId= juegoDeEscaperoomId;
      this.orden=orden;
    }
  }