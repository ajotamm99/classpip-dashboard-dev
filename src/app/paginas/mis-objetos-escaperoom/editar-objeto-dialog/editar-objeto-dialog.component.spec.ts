import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarObjetoDialogComponent } from './editar-objeto-dialog.component';

describe('EditarObjetoDialogComponent', () => {
  let component: EditarObjetoDialogComponent;
  let fixture: ComponentFixture<EditarObjetoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarObjetoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarObjetoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
