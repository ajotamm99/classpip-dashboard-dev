import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarPreguntasEscaperoomComponent } from './asignar-preguntas-escaperoom.component';

describe('AsignarPreguntasEscaperoomComponent', () => {
  let component: AsignarPreguntasEscaperoomComponent;
  let fixture: ComponentFixture<AsignarPreguntasEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarPreguntasEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarPreguntasEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
