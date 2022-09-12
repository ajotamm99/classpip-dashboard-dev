import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisSkinsEscaperoomComponent } from './mis-skins-escaperoom.component';

describe('MisSkinsEscaperoomComponent', () => {
  let component: MisSkinsEscaperoomComponent;
  let fixture: ComponentFixture<MisSkinsEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisSkinsEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisSkinsEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
