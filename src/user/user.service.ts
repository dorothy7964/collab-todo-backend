import { JwtService } from '@/jwt/jwt.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { UserLookupOutput } from './dtos/user-search.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    nickname,
    profileImage,
    password,
    role,
  }: CreateAccountInput) {
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
        this.user.create({ email, nickname, profileImage, password, role }),
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

      const token = this.jwtService.sign(user.id);

      return { ok: true, token };
    } catch (e) {
      console.log('📢 [user.service.ts][login]', e);
      return { ok: false, error: '로그인에 실패했습니다.' };
    }
  }

  async editProfile(
    userId: number,
    { nickname, password, profileImage }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.user.findOne({ where: { id: userId } });

      if (nickname) {
        const existingNickname = await this.user.findOne({
          where: { nickname },
        });

        if (existingNickname && existingNickname.id !== userId) {
          return {
            ok: false,
            error: '사용 중인 닉네임입니다.',
          };
        }

        user.nickname = nickname;
      }

      if (password) {
        user.password = password;
      }

      if (profileImage) user.profileImage = profileImage;

      await this.user.save(user);

      return { ok: true };
    } catch (e) {
      console.log('📢 [user.service.ts][editProfile]', e);
      return { ok: false, error: '프로필을 수정할 수 없습니다.' };
    }
  }

  async findById(userId: number): Promise<UserProfileOutput> {
    //  JwtMiddleware에서도 findById 함수 사용중 (토큰 해독 후 유저 찾을 때)
    try {
      const user = await this.user.findOneOrFail({ where: { id: userId } });
      return {
        ok: true,
        user,
      };
    } catch (e) {
      console.log('📢 [user.service.ts][findById]', e);
      return { ok: false, error: '사용자를 찾을 수 없습니다.' };
    }
  }

  async findUser(userEmail: string): Promise<UserLookupOutput> {
    try {
      const user = await this.user.findOne({
        where: { email: userEmail },
      });

      if (!user) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }

      return {
        ok: true,
        user,
      };
    } catch (e) {
      console.log('📢 [user.service.ts][findByEmail]', e);
      return { ok: false, error: '사용자를 찾을 수 없습니다.' };
    }
  }
}
