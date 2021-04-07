import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaUglComponent } from './hoja-ugl.component';

describe('HojaUglComponent', () => {
  let component: HojaUglComponent;
  let fixture: ComponentFixture<HojaUglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HojaUglComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HojaUglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
