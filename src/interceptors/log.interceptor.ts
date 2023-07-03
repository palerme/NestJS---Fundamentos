import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const dt = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();

        console.log(`URL: ${request.url}`);
        console.log(`METHOD: ${request.method}`);
        if (JSON.stringify(request.body).length >= 3) {
          console.log(`DATA: ${JSON.stringify(request.body)}`);
        }
        console.log(`Execução levou: ${Date.now() - dt} milissegundos.`);
      }),
    );
  }
}
