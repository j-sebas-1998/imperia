import { TestBed } from '@angular/core/testing';
import { AuthPage } from './auth';

describe('AuthPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPage],
    }).compileComponents();
  });

  it('should create the authentication page', () => {
    const fixture = TestBed.createComponent(AuthPage);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should accept a valid CC and alphanumeric password', () => {
    const fixture = TestBed.createComponent(AuthPage);
    const component = fixture.componentInstance;

    component.loginForm.patchValue({
      username: '1234567890',
      password: 'Clave123',
    });

    expect(component.loginForm.valid).toBeTrue();
    expect(component.loginForm.get('username')?.errors).toBeNull();
    expect(component.loginForm.get('password')?.errors).toBeNull();
  });
});
