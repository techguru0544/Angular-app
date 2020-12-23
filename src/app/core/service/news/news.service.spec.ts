import { TestBed } from '@angular/core/testing';

import { newsService } from './news.service';

describe('newsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: newsService = TestBed.get(newsService);
    expect(service).toBeTruthy();
  });
});
