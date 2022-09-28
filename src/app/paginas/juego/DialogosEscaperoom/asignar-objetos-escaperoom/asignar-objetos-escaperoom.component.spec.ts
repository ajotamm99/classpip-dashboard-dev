import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarObjetosEscaperoomComponent } from './asignar-objetos-escaperoom.component';

describe('AsignarObjetosEscaperoomComponent', () => {
  let component: AsignarObjetosEscaperoomComponent;
  let fixture: ComponentFixture<AsignarObjetosEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarObjetosEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarObjetosEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
