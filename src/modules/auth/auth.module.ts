import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTHORIZE_PACKAGE_NAME } from 'src/proto-interfaces/authorize';
import { USER_PACKAGE_NAME } from 'src/proto-interfaces/user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTHORIZE_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: AUTHORIZE_PACKAGE_NAME,
          protoPath: 'src/proto/authorize.proto',
        },
      },
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: USER_PACKAGE_NAME,
          protoPath: 'src/proto/user.proto',
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
