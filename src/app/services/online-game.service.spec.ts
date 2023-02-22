import { TestBed } from '@angular/core/testing';

import { OnlineGameService } from './online-game.service';

describe('OnlineGameService', () => {
  let service: OnlineGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
