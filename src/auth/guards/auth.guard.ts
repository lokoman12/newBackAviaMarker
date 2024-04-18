import {
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// @Injectable()
// export class AuthGuard implements CanActivate {
//   private readonly log = new Logger(AuthGuard.name);

//   private static USER_KEY = 'user';

//   constructor(
//     private jwtService: JwtService,
//     private reflector: Reflector
//   ) { }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     this.log.log('AuthGuard canActivate');

//     const isPublic = this.reflector.getAllAndOverride<boolean>(
//       IS_PUBLIC_KEY,
//       [
//         context.getHandler(),
//         context.getClass(),
//       ]
//     );
//     // Ручка с доступом без аутентификации
//     if (isPublic) {
//       this.log.log('AuthGuard return true');
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
    
//     this.log.log("AuthGuard, token", token)
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.jwtService.verifyAsync(
//         token,
//         {
//           secret: jwtConstants.secret
//         }
//       );

//       request[AuthGuard.USER_KEY] = payload;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | null {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : null;
//   }
// }
