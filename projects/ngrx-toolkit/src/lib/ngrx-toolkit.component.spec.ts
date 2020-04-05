import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgrxToolkitComponent } from './ngrx-toolkit.component';

describe('NgrxToolkitComponent', () => {
  let component: NgrxToolkitComponent;
  let fixture: ComponentFixture<NgrxToolkitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgrxToolkitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgrxToolkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
