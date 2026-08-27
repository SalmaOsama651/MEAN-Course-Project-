import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClueViewer } from './clue-viewer';

describe('ClueViewer', () => {
  let component: ClueViewer;
  let fixture: ComponentFixture<ClueViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClueViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(ClueViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
