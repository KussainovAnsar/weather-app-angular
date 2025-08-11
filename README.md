# WeatherApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Ответ на 5ое задание 
Оптимизация производительности:
• Дан фрагмент кода с низкой производительностью. Необходимо оптимизировать
его для ускорения выполнения.
funceon processLargeData(data) {
 let result = [];
 for (let i = 0; i < data.length; i++) {
 // Предположим, что performComplexCalculaeon - это тяжёлая операция
 result[i] = performComplexCalculaeon(data[i]);
 }
 return result;
}
// Функция performComplexCalculaeon просто для примера
funceon performComplexCalculaeon(item) {
 // Некая сложная логика обработки
 return item * item; // Пример вычисления
}
// Пример использования с большим массивом данных
const largeData = new Array(10000).fill(1).map((_, index) => index);
console.log(processLargeData(largeData));


можно использовать кэширование 

const cache = new Map();

function performComplexCalculation(item) {
  if (cache.has(item)) return cache.get(item);
  const result = item * item; // сложная логика
  cache.set(item, result);
  return result;
}

function processLargeData(data) {
  return data.map(performComplexCalculation);
}


можно использовать паралельную обработку (вывести в отдельные потоки) через веб воркер 
еще использовать асинхронные функций если это запроси по API


