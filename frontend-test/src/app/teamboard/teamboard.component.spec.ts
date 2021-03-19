import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamboardComponent } from './teamboard.component';

describe('TeamboardComponent', () => {
  let component: TeamboardComponent;
  let fixture: ComponentFixture<TeamboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
