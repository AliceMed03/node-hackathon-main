import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const qs = require('qs');

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(loginRequestDto: LoginRequestDto) {
    const apiURL = 'https://api.sandbox.appnext.fit/api/';

    const params = {
      grant_type: 'password',
      username: loginRequestDto.Usuario,
      password: loginRequestDto.Senha,
      codigoTenant: 7,
      codigoUnidade: 7,
    };

      const data = qs.stringify(params);
      const response = await firstValueFrom(this.httpService.post(`${apiURL}Token`, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }));

      return response.data;
  }
}
