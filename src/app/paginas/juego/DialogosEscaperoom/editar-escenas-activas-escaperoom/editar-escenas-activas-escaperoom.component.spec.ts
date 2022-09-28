import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEscenasActivasEscaperoomComponent } from './editar-escenas-activas-escaperoom.component';

describe('EditarEscenasActivasEscaperoomComponent', () => {
  let component: EditarEscenasActivasEscaperoomComponent;
  let fixture: ComponentFixture<EditarEscenasActivasEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarEscenasActivasEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEscenasActivasEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
