import { TestBed } from '@angular/core/testing';

import { ActionnaireService } from './actionnaire.service';

describe('ActionnaireService', () => {
  let service: ActionnaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionnaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
