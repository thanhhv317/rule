import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSideAngularWayComponent } from './server-side-angular-way.component';

describe('ServerSideAngularWayComponent', () => {
  let component: ServerSideAngularWayComponent;
  let fixture: ComponentFixture<ServerSideAngularWayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerSideAngularWayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerSideAngularWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
