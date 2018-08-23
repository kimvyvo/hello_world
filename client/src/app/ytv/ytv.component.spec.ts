import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YtvComponent } from './ytv.component';

describe('YtvComponent', () => {
  let component: YtvComponent;
  let fixture: ComponentFixture<YtvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YtvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YtvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
