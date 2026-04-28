import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTHORIZE_PACKAGE_NAME } from 'src/proto-interfaces/authorize';
import { AuthController } from './auth.controller';

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
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
