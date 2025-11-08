import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [
    {
      provide: 'APP_CONSTANTS',
      useValue: {
        CURRENT_YEAR: new Date().getFullYear(),
        BROTHER_JUSTIFICATION: 1,
        HOUSING_JUSTIFICATION: 2,
        WORKPLACE_JUSTIFICATION: 3,
        ROLES: {
          DIRECTOR_ROLE: 9,
          DISTRICT_ROLE: 37,
          DEPARTMENT_ROLE: 850, //subdirector
          VER_ROLE: 4100,
          POSTULANT_ROLE: 4100,
          ADMIN_ROLE: 4000
        }
      }
    }
  ],
  exports: ['APP_CONSTANTS']
})
export class ConstantModule {}