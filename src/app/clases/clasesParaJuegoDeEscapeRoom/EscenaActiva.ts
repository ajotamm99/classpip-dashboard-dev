export class EscenaActiva {

    id: number;
    escenarioEscaperoomId: number;
    escenaEscaperoomId: number;
    juegoDeEscaperoomId: number;
  
    constructor(escenarioEscaperoomId?: number, escenaEscaperoomId?: number, juegoDeEscaperoomId?: number) {
  
      this.escenarioEscaperoomId = escenarioEscaperoomId 
      this.escenaEscaperoomId = escenaEscaperoomId;
      this.juegoDeEscaperoomId= juegoDeEscaperoomId;
    }
  }