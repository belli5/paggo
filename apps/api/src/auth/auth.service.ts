import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const user = await this.userService.create(data);

    const accessToken = await this.generateToken(user.id, user.email);

    return {
      message: 'Usuário cadastrado com sucesso',
      user,
      access_token: accessToken,
    };
  }

  async login(data: LoginDto) {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const passwordIsValid = await bcrypt.compare(data.password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const accessToken = await this.generateToken(user.id, user.email);

    return {
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      access_token: accessToken,
    };
  }

  private async generateToken(userId: string, email: string) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
    });
  }
}