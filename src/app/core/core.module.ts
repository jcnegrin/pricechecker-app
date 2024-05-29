import { APP_INITIALIZER, ErrorHandler, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorHandler } from './services/global-error-handler';
import { AppInitService } from './services/app-init.service';
import { throwIfAlreadyLoaded } from './guards/module-import-guard';

export function initializerFactory(appConfig: AppInitService) {
  return (): Promise<any> => appConfig.init();
}


@NgModule({
  imports: [
    CommonModule,
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    throwIfAlreadyLoaded(parentModule, "CoreModule");
  }
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: ErrorHandler,
          useClass: GlobalErrorHandler,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initializerFactory,
          deps: [AppInitService],
          multi: true,
        },
        AppInitService,
      ],
    };
  }
}
