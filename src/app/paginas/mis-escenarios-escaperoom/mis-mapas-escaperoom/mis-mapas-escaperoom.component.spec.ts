import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisMapasEscaperoomComponent } from './mis-mapas-escaperoom.component';

describe('MisMapasEscaperoomComponent', () => {
  let component: MisMapasEscaperoomComponent;
  let fixture: ComponentFixture<MisMapasEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisMapasEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisMapasEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
