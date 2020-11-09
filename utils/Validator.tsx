import validator from 'validator';

export default class Validators {
  static required = (errors: any, name: string, values: any) => {
    if (validator.isEmpty(values[name] ?? '')) {
      errors[name] = `${name} is required`;
    }
  }

  static boolean = (errors: any, name: string, values: any) => {
    if (values[name] !== false && values[name] !== true) {
      errors[name] = `${name} should be true or false.`;
    }
  }

  static password = (errors: any, name: string, values: any) => {
    if (validator.isEmpty(values[name] ?? '')) {
      errors[name] = `${name} is required`;
      return;
    }

    const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    if (!regex.test(values[name])) {
      errors[name] = `${name} is not a strong enough. At least 1 uppercase character, 1 numeric character and 1 special character.`;
    }

    if (values[name] !== values[`${name}_repeat`]) {
      errors[name] = 'passwords do not match.';
    }
  }

  static email = (errors: any, name: string, values: any) => {
    if (validator.isEmpty(values[name] ?? '')) {
      return;
    }

    if (!validator.isEmail(values[name])) {
      errors[name] = 'Not a valid e-mailaddress ';
    }
  }

  static test = (values: any, requirements: any): any => {
    const errors: any = {};
    Object.keys(requirements).forEach((name: string) => {
      const validators: Array<any> = requirements[name];
      if (Array.isArray(validators)) {
        validators.forEach((validate) => {
          if (typeof validate === 'function') {
            validate(errors, name, values);
          }

          if (typeof validator === 'object' && Array.isArray(values[name])) {
            values[name].forEach((value: any, index: number) => {
              const error = Validators.test(value, validate);
              if (Object.keys(error).length > 0) {
                if (!errors[name]) {
                  errors[name] = [];
                }

                errors[name][index] = error;
              }
            });
          }
        });
      }
    });

    return errors;
  }
}
