import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UglComponent } from './ugl.component';

describe('UglComponent', () => {
  let component: UglComponent;
  let fixture: ComponentFixture<UglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UglComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
