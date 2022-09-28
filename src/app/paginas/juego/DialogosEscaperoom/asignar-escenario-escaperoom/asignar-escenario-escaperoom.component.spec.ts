import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarEscenarioEscaperoomComponent } from './asignar-escenario-escaperoom.component';

describe('AsignarEscenarioEscaperoomComponent', () => {
  let component: AsignarEscenarioEscaperoomComponent;
  let fixture: ComponentFixture<AsignarEscenarioEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarEscenarioEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarEscenarioEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
