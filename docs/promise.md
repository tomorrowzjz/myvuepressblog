# promise
## promise 抛出错误
> const promise = new Promise(function (resolve, reject) {
    resolve('ok');
    setTimeout(function () { throw new Error('test') }, 0)
  });
  promise.then(function (value) { console.log(value) });
## promise 内部的错误不会影响到 Promise 外部的代码，
  const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
      // 下面一行会报错，因为x没有声明
      resolve(x + 2);
    });
  };
  someAsyncThing().then(function() {
    console.log('everything is great');
  });
  setTimeout(() => { console.log(123) }, 2000);
