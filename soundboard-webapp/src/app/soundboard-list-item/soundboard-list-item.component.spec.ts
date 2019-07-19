import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundboardListItemComponent } from './soundboard-list-item.component';

describe('SoundboardListItemComponent', () => {
  let component: SoundboardListItemComponent;
  let fixture: ComponentFixture<SoundboardListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundboardListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundboardListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
