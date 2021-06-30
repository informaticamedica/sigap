import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaAuditoriaComponent } from './nueva-auditoria.component';

describe('NuevaAuditoriaComponent', () => {
  let component: NuevaAuditoriaComponent;
  let fixture: ComponentFixture<NuevaAuditoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaAuditoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
