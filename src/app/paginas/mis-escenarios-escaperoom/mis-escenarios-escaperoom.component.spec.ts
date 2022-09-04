import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEscenariosEscaperoomComponent } from './mis-escenarios-escaperoom.component';

describe('MisEscenariosEscaperoomComponent', () => {
  let component: MisEscenariosEscaperoomComponent;
  let fixture: ComponentFixture<MisEscenariosEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisEscenariosEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisEscenariosEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
