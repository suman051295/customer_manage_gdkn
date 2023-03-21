import { TestBed } from '@angular/core/testing';

import { WebInterceptor } from './web.interceptor';

describe('WebInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      WebInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: WebInterceptor = TestBed.inject(WebInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
