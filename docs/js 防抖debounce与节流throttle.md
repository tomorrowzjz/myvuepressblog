# js 防抖debounce与节流throttle

## 防抖debounce

顾名思义防止用户点击按钮的时候抖动，短时间内触发多次按钮事件。在触发事件的n秒后执行，如果在n秒内用户又重新触发就以新事件为准，将原事件清空，重新等待n秒后执行。（如果用户在等待n秒内重复触发，则该事件会一直等待直到用户不在触发n秒过后执行）

```js
//简洁版
function debounce(func, wait) {
    var timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait);
    }
}
```

```js
function debounce(func, wait) {
    var timeout;
    return function () {
        //保存调用debounce的this
        var context = this;
        //func函数的参数
        var args = arguments;
        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context, args)
        }, wait);
    }
}
```

## 节流throttle

与防抖不同的是节流会降低某一个事件的执行频率（如window 的resize、scroll），如果用户在未使用节流的前提下，1秒内触发某个事件100次，通过使用节流函数throttle(func, 100),func指的是用户触发的函数，100指的是触发频率100毫秒，那么用户在使用节流函数后1秒内只执行10次(1秒=1000毫秒)

```js
//简洁版 时间版(第一次触发事件会立刻执行)
function throttle(func, wait) {
    let defaultTime = 0
    return function () {
        //保存调用debounce的this
        var context = this;
        //func函数的参数
        var args = arguments;
        let currentTime = new Date().getTime()
        if(currentTime-defaultTime>wait){
            func.apply(context, args)
            defaultTime = currentTime
        }
    }
}
```



```js
//简洁版 定时器版(第一次事件会在n秒后执行)
function debounce(func, wait) {
    var timeout = null;
    return function () {
        var context = this;
        var args = arguments;
        if(!timeout){
            timeout = setTimeout(function(){
                func.apply(context, args)
                timeout = null
            }, wait);
        }
    }
}
```

