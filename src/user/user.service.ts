import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dtos/create-account.dto';

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
}
