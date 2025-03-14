import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: ['deleteOwnUser', 'Task'],
  [Role.ADMIN]: ['getUsers', 'manageUsers', 'Task']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
