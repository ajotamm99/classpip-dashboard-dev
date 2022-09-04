export class EquipoJuegoDeEscaperoom {

    PuntosTotalesAlumno: number;
    id: number;
    EquipoId: number;
    JuegoDeEscaperoomId: number;
    TiempoEnResolver: number;
    Resuelto: boolean;
  
    constructor(EquipoId?: number, JuegoDeEscaperoomId?: number, PuntosTotalesAlumno?: number, id?: number) {
  
      this.PuntosTotalesAlumno = PuntosTotalesAlumno;
      this.id = id;
      this.EquipoId = EquipoId;
      this.JuegoDeEscaperoomId = JuegoDeEscaperoomId;
      this.TiempoEnResolver = 0;
      this.Resuelto = false;
    }
  }