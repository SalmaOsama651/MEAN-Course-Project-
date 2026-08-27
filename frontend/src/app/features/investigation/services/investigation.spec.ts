import { TestBed } from '@angular/core/testing';
import { Investigation } from './investigation';

describe('Investigation', () => {
  let service: Investigation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Investigation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
