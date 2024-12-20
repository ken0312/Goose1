import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglemapComponent } from './googlemap.component';

describe('GooglemapComponent', () => {
  let component: GooglemapComponent;
  let fixture: ComponentFixture<GooglemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GooglemapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GooglemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
