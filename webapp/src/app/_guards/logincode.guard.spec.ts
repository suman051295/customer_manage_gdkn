import { TestBed } from '@angular/core/testing';

import { LogincodeGuard } from './logincode.guard';

describe('LogincodeGuard', () => {
  let guard: LogincodeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LogincodeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
