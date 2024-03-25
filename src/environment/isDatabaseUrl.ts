import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

const DATABASE_URL_REGEX = /^(mysql|postgresql):\/{2}(\w+):(\w+)@(\w+|(?:\w{1,3}\.){3}\w{1,3}):(\d+)\/(\w+).*$/;

export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsLongerThanConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isLongerThan' })
export class IsLongerThanConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    const matches = DATABASE_URL_REGEX.exec(value);
    if (matches) {
      let [, protocol, username, password, host, port, database] = matches;
      console.log('-----', typeof protocol, username, password, host, typeof port, database);
    }

    return typeof value === 'string';
  }
}