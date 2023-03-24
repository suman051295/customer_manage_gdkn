import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTwoFactorComponent } from './login-two-factor.component';

describe('LoginTwoFactorComponent', () => {
  let component: LoginTwoFactorComponent;
  let fixture: ComponentFixture<LoginTwoFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginTwoFactorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginTwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
