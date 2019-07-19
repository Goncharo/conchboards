import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundboardsComponent } from './soundboards.component';

describe('SoundboardsComponent', () => {
  let component: SoundboardsComponent;
  let fixture: ComponentFixture<SoundboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
