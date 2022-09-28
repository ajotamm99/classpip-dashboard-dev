import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarObjetosActivosEscaperoomComponent } from './editar-objetos-activos-escaperoom.component';

describe('EditarObjetosActivosEscaperoomComponent', () => {
  let component: EditarObjetosActivosEscaperoomComponent;
  let fixture: ComponentFixture<EditarObjetosActivosEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarObjetosActivosEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarObjetosActivosEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
