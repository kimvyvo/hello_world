import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvVideoComponent } from './ov-video.component';

describe('OvVideoComponent', () => {
  let component: OvVideoComponent;
  let fixture: ComponentFixture<OvVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
