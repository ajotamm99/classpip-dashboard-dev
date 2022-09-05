export class EscenaActiva {

    id: number;
    escenarioEscaperoomId: number;
    escenaEscaperoomId: number;
    juegoDeEscaperoomId: number;
  
    constructor(escenarioEscaperoomId?: number, escenaEscaperoomId?: number, id?: number, juegoDeEscaperoomId?: number) {
  
      this.id = id;
      this.escenarioEscaperoomId = escenarioEscaperoomId 
      this.escenaEscaperoomId = escenaEscaperoomId;
      this.juegoDeEscaperoomId= juegoDeEscaperoomId;
    }
  }