import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarEscenasEscaperoomComponent } from './asignar-escenas-escaperoom.component';

describe('AsignarEscenasEscaperoomComponent', () => {
  let component: AsignarEscenasEscaperoomComponent;
  let fixture: ComponentFixture<AsignarEscenasEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarEscenasEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarEscenasEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
