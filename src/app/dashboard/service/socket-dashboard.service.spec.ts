import { TestBed } from '@angular/core/testing';

import { SocketDashboardService } from './socket-dashboard.service';

describe('SocketDashboardService', () => {
  let service: SocketDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
