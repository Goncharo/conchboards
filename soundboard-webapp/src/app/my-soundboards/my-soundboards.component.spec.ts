import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySoundboardsComponent } from './my-soundboards.component';

describe('MySoundboardsComponent', () => {
  let component: MySoundboardsComponent;
  let fixture: ComponentFixture<MySoundboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySoundboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySoundboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
