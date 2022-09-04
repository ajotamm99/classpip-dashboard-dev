export class AlumnoJuegoDeEscaperoom {

    PuntosTotalesAlumno: number;
    id: number;
    AlumnoId: number;
    JuegoDeEscaperoomId: number;
    TiempoEnResolver: number;
    Resuelto: boolean;
  
    constructor(AlumnoId?: number, JuegoDeEscaperoomId?: number, PuntosTotalesAlumno?: number, id?: number) {
  
      this.PuntosTotalesAlumno = PuntosTotalesAlumno;
      this.id = id;
      this.AlumnoId = AlumnoId;
      this.JuegoDeEscaperoomId = JuegoDeEscaperoomId;
      this.TiempoEnResolver = 0;
      this.Resuelto = false;
    }
  }