import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async createAccount({ email, nickname, password, role }: CreateAccountInput) {
    try {
      const emailExists = await this.user.findOne({ where: { email } });
      const nicknameExists = await this.user.findOne({ where: { nickname } });

      if (emailExists) {
        return {
          ok: false,
          error: '이미 해당 이메일을 사용하는 사용자가 있습니다.',
        };
      }

      if (nicknameExists) {
        return {
          ok: false,
          error: '이미 해당 닉네임은 사용하는 사용자가 있습니다.',
        };
      }
      await this.user.save(
        this.user.create({ email, nickname, password, role }),
      );

      return { ok: true };
    } catch (e) {
      console.log('📢 [user.service.ts][createAccount]', e);
      return { ok: false, error: '계정 생성에 실패했습니다.' };
    }
  }

  async login({ email, password }: LoginInput) {
    try {
      const user = await this.user.findOne({ where: { email } });
      if (!user) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 올바르지 않습니다.',
        };
      }

      return { ok: true, token: '임시토큰 발급 중' };
    } catch (e) {
      console.log('📢 [user.service.ts][login]', e);
      return { ok: false, error: '로그인에 실패했습니다.' };
    }
  }
}
