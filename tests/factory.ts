import { faker } from '@faker-js/faker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IReturnedTypes = string | any;

const builders: Record<string, Record<string, () => IReturnedTypes>> = {};

const factory = {
  attrs: <T = Record<string, IReturnedTypes>>(name: string) => {
    if (!builders[name]) {
      throw new Error(`Entity "${name} not defined`);
    }

    const builder = builders[name];

    return Object.keys(builder).reduce<T>((entity, field) => {
      const value = builder[field]();
      entity[field as keyof T] = value;
      return entity;
    }, {} as T);
  },

  define: (name: string, recipe: Record<string, () => IReturnedTypes>) => {
    builders[name] = recipe;
  },
};

factory.define('User', {
  name: faker.name.fullName,
  email: faker.internet.email,
  password: faker.internet.password,
});

export { factory };
