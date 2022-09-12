import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEnigmasDialogComponent } from './editar-enigmas-dialog.component';

describe('EditarEnigmasDialogComponent', () => {
  let component: EditarEnigmasDialogComponent;
  let fixture: ComponentFixture<EditarEnigmasDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarEnigmasDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEnigmasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
