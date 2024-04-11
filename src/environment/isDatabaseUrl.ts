import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";


export const DATABASE_URL_REGEX = /^(mysql|postgresql):\/{2}(\w+):(\w+)@(\w+|(?:\w{1,3}\.){3}\w{1,3}):(\d+)\/(\w+).*$/;

export function IsDatabaseUrl(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidDatabaseUrlConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isValidDatabaseUrl' })
export class IsValidDatabaseUrlConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    const matches = DATABASE_URL_REGEX.exec(value);
    if (matches) {
      let [, protocol, username, password, host, port, database] = matches;
      console.log('-----', typeof protocol, username, password, host, typeof port, database);
      return true;
    }

    return false;
  }
}