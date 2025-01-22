import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonApiResponse } from 'src/shared/api/JsonApiResponse.interface.';

// TODO : Move json api response here ?

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, JsonApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<JsonApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // If the data already has the correct format, return it as is
        if (data?.type) {
          return data;
        }

        // Get the request object to determine the resource type
        const request = context.switchToHttp().getRequest();
        const resourceType = this.getResourceType(request.path);

        return {
          type: resourceType,
          data,
        };
      }),
    );
  }

  private getResourceType(path: string): string {
    // Remove leading slash and get the first segment of the path
    const resource = path.split('/')[1];
    return resource || 'unknown';
  }
}