import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPreguntasActivasEscaperoomComponent } from './editar-preguntas-activas-escaperoom.component';

describe('EditarPreguntasActivasEscaperoomComponent', () => {
  let component: EditarPreguntasActivasEscaperoomComponent;
  let fixture: ComponentFixture<EditarPreguntasActivasEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPreguntasActivasEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPreguntasActivasEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
