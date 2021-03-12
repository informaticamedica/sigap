import { TestBed } from '@angular/core/testing';

import { DatosDbService } from './datos-db.service';

describe('DatosDbService', () => {
  let service: DatosDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
