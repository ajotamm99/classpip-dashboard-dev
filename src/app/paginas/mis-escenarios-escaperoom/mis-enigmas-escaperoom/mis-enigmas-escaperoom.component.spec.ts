import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEnigmasEscaperoomComponent } from './mis-enigmas-escaperoom.component';

describe('MisEnigmasEscaperoomComponent', () => {
  let component: MisEnigmasEscaperoomComponent;
  let fixture: ComponentFixture<MisEnigmasEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisEnigmasEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisEnigmasEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
