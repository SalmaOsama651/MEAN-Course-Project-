import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Investigation } from './investigation';

describe('Investigation', () => {
  let component: Investigation;
  let fixture: ComponentFixture<Investigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Investigation],
    }).compileComponents();

    fixture = TestBed.createComponent(Investigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
