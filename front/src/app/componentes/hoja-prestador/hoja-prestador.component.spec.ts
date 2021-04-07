import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaPrestadorComponent } from './hoja-prestador.component';

describe('HojaPrestadorComponent', () => {
  let component: HojaPrestadorComponent;
  let fixture: ComponentFixture<HojaPrestadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HojaPrestadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HojaPrestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
