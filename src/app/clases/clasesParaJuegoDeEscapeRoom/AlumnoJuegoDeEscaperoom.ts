export class AlumnoJuegoDeEscaperoom {

    PuntosTotalesAlumno: number;
    id: number;
    alumnoId: number;
    juegoDeEscaperoomId: number;
    TiempoEnResolver: number;
    Resuelto: boolean;
  
    constructor(alumnoId?: number, juegoDeEscaperoomId?: number, PuntosTotalesAlumno?: number, id?: number) {
  
      this.PuntosTotalesAlumno = PuntosTotalesAlumno;
      this.id = id;
      this.alumnoId = alumnoId;
      this.juegoDeEscaperoomId = juegoDeEscaperoomId;
      this.TiempoEnResolver = 0;
      this.Resuelto = false;
    }
  }