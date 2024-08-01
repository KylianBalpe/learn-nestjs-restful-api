import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        status: 'error',
        code: exception.getStatus(),
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        status: 'error',
        code: 400,
        errors: 'Validation error',
      });
    } else {
      response.status(500).json({
        status: 'error',
        code: 500,
        errors: exception.message,
      });
    }
  }
}
