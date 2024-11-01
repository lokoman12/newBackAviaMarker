import { DIRECTOR, DISPATCHER, ENGINEER } from "./consts";
import { isArray, isString } from 'lodash';

export const hasRole = (particulerRole: string, roles: string | Array<string>) => {
  let iterateeRoles: Array<string>;
  
  if (isString(roles)) {
    iterateeRoles = roles.split(',');
  } else if (isArray(roles)) {
    iterateeRoles = roles;
  } else {
    throw new Error(`Parameter roles must be comma delimited string or array of string!`);
  }

  return iterateeRoles?.map(it => it.toLowerCase())?.includes(particulerRole);
}

export const hasDispatcherRole = (roles: string | Array<string>) => {
  return hasRole(DISPATCHER, roles);
}

export const hasEngineerRole = (roles: string | Array<string>) => {
  return hasRole(ENGINEER, roles);
}

export const hasDirectorRole = (roles: string | Array<string>) => {
  return hasRole(DIRECTOR, roles);
}
