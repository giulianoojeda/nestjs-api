import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the user in the database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      //if the password is correct, return a signed JWT
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    //find the user in the database
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if the user is not found, throw an error
    if (!user) {
      throw new ForbiddenException('Wrong email or password');
    }
    // compare the password hash with the password provided by the user
    const isPasswordValid = await argon.verify(user.hash, dto.password);

    //if the password is incorrect, throw an error
    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong email or password');
    }
    //if the password is correct, return a signed JWT
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return { access_token: token };
  }
}
