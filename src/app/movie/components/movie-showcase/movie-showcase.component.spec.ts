import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieShowcaseComponent } from './movie-showcase.component';

describe('MovieShowcaseComponent', () => {
  let component: MovieShowcaseComponent;
  let fixture: ComponentFixture<MovieShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
