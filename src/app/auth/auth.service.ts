import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly registeredUsers = new Map<string, string>();

  register(username: string, password: string): { success: boolean; message: string } {
    const normalizedUsername = username.trim();

    if (this.registeredUsers.has(normalizedUsername)) {
      return {
        success: false,
        message: 'El número de cédula ya está registrado.',
      };
    }

    this.registeredUsers.set(normalizedUsername, password);

    return {
      success: true,
      message: 'Usuario registrado correctamente.',
    };
  }

  login(username: string, password: string): boolean {
    return this.registeredUsers.get(username.trim()) === password;
  }

  isRegistered(username: string): boolean {
    return this.registeredUsers.has(username.trim());
  }
}
