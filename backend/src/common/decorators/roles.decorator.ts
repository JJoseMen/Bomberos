import { SetMetadata } from '@nestjs/common';
import { RolInterno } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolInterno[]) => SetMetadata(ROLES_KEY, roles);