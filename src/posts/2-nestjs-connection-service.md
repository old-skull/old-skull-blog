_07-08-2021_

[#nestjs](tags/nestjs)

# NestJS connection service

After I spent a couple of months with Nest, I found a perfect way to organize my connections to databases, message queues, or other services.

There are 2 "classic" ways to set up a connection. You can find it in the [NestJS docs](https://docs.nestjs.com/).

## 1) Pass the credentials directly to the module

```ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

## 2) Create a provider and register it in the target module.

### Provider

```ts
import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'test',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
  },
];
```

### Target module

```ts
import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
```

## Can we do better?

It's a simple and convenient options. But I always like to split my application logic into small pieces. So, after some digging, I found a better way.

## Idea

First of all, let's see other methods in TypeOrmModule.

![](img/2/2-1.png)

There are 3 main methods that allow you to register a module. I'm not going to focus on <code class="language-inline">forFeature</code>. Instead, we will look <code class="language-inline">forRootAsync</code>. Let's dive deeper and see what the available options are.

![](img/2/2-2.png)

As you can see in this static method, we can configure TypeOrmModule using <code class="language-inline">inject</code> or <code class="language-inline">useFactory</code>. They allows to configure this module dynamically. The most important part here is the return type.

![](img/2/2-3.png)

```ts
TypeOrmModuleOptions | Promise<TypeOrmModuleOptions>
```

So we need to provide objects of this shape/type. Now let's compare it to <code class="language-inline">useClass</code>.

![](img/2/2-4.png)

```ts
TypeOrmOptionsFactory;
```

As you can see, we can use some class and this type to create connection via <code class="language-inline">useClass</code>.

## Implementation

Let's create a class. I usually call it **SomeConnectionService**, where **Some** is the name of a database or provider. In this case, PgConnectionService. And if we check out the previous type, <code class="language-inline">TypeOrmOptionsFactory</code>, we will find out that its an interface and we can implement it.

### pg-connection.service.ts

```ts
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class PgConnectionService implements TypeOrmOptionsFactory {}
```

After that, your IDE or editor throws an error about interface implementation.

![](img/2/2-5.png)

And if we fix it, we will get <code class="language-inline">createTypeOrmOptions</code> method with the signature from the interface. This method returns the object with database configuration and you could just copy your credentials.

```ts
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class PgConnectionService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: '0.0.0.0',
      port: 5432,
      username: 'pg',
      password: 'pg',
      database: 'pg',
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity.js'],
      retryAttempts: 5,
    };
  }
}
```

Then you need to register created class via <code class="language-inline">useClass</code>

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgConnectionService } from './services/pg-connection.service';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: PgConnectionService })],
})
export class PgModule {}
```

That's it!

## Conclusion

Now your connection has a separate service. Also, you could write tests for service. In the next articles, I will show different cases of this technique.

## Links

- [Classic way from docs #1](https://docs.nestjs.com/techniques/database)
- [Classic way from docs #2](https://docs.nestjs.com/recipes/sql-typeorm#getting-started)
