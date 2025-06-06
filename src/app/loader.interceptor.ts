import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from './loader/shared/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  let loaderService = inject(LoaderService);

  loaderService.show();

  return next(req).pipe(finalize(() => loaderService.hide()));
};
