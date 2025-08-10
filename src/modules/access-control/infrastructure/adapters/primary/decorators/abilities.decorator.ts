import { SetMetadata } from '@nestjs/common';

export const CHECK_ABILITY = 'check_ability';

export type RequiredRule = { action: string; subject: string };

export const CheckAbilities = (...rules: RequiredRule[]) => SetMetadata(CHECK_ABILITY, rules);
