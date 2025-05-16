import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShowcaseComponent } from './list.component';

describe('ListShowcaseComponent', () => {
  let component: ListShowcaseComponent;
  let fixture: ComponentFixture<ListShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListShowcaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
