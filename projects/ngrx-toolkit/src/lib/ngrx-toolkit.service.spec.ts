import { TestBed } from '@angular/core/testing';

import { NgrxToolkitService } from './ngrx-toolkit.service';

describe('NgrxToolkitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgrxToolkitService = TestBed.get(NgrxToolkitService);
    expect(service).toBeTruthy();
  });
});
