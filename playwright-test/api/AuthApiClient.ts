import { APIRequestContext, APIResponse } from '@playwright/test';
import { envConfig } from '../config/env';

export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  deviceId: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  deviceId: string;
}

export class AuthApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl = envConfig.apiBaseUrl) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  registerDeviceId(deviceID: string): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/deviceId`, {
      data: deviceID ? { deviceID } : {},
    });
  }

  signup(payload: SignupRequest): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/auth/signup`, {
      data: payload,
    });
  }

  login(payload: LoginRequest): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/auth/login`, {
      data: payload,
    });
  }
}
