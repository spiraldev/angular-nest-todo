import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Model } from 'mongoose';
import { IUser } from '../users/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { debug } from 'console';
import { RegistrationStatus } from './interfaces/registrationStatus.interface';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                @InjectModel('User') private readonly userModel: Model<IUser>) { }

    async register(user: IUser) {
        const result: RegistrationStatus = await this.userModel.register(new this.userModel({username: user.email,
            firstName: user.firstName,
            lastName: user.lastName}), user.password, (err) => {
            let status: RegistrationStatus;
            if (err) {
                debug(err);
                status = { success: false, message: err };
                return status;
            }

            status = { success: false, message: 'user register' };
            debug(status.message);
            return status;
        });

        return result;
    }

    async login(){

    }

    async createToken(user) {
        const expiresIn = 3600;
        const accessToken = jwt.sign({ id: user.id, email: user.username }, 'secretKey', { expiresIn });
        return {
            expiresIn,
            accessToken,
        };
    }
    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findById(payload.id);
    }
}
