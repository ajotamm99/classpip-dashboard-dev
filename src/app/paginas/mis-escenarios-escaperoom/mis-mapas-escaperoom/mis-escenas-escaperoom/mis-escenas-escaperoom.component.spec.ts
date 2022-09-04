import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEscenasEscaperoomComponent } from './mis-escenas-escaperoom.component';

describe('MisEscenasEscaperoomComponent', () => {
  let component: MisEscenasEscaperoomComponent;
  let fixture: ComponentFixture<MisEscenasEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisEscenasEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisEscenasEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
