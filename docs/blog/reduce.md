# reduce
参考链接
[https://www.runoob.com/jsref/jsref-reduce.html]:



## 定义和用法

​	reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
​	reduce() 可以作为一个高阶函数，用于函数的 compose。
​	注意: reduce() 对于空数组是不会执行回调函数的。

## 语法

```js
        array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
```

## 参数

| 参数                                      | 描述                                                         |
| :---------------------------------------- | :----------------------------------------------------------- |
| *function(total,currentValue, index,arr)* | 必需。用于执行每个数组元素的函数。 函数参数:参数描述*total*必需。*初始值*, 或者计算结束后的返回值。*currentValue*必需。当前元素*currentIndex*可选。当前元素的索引*arr*可选。当前元素所属的数组对象。 |
| *initialValue*                            | 可选。传递给函数的初始值                                     |

## 例子(数组去重)

```js
var newArr = arr.reduce(function (prev, cur) {
    !prev.includes(cur) && prev.push(cur);
    return prev;
},[]);
```

**分析**

   1.初始化一个空数组
   2.将需要去重处理的数组中的第1项在初始化数组中查找，如果找不到，就将该项添加到初始化数组中

   3. 将需要去重处理的数组中的第2项在初始化数组中查找，如果找不到，就将该项继续添加到*初始化数组中
   4. ……
   5.  将需要去重处理的数组中的第n项在初始化数组中查找，如果找不到，就将该项继续添加到初始化数组中
   6. 将这个初始化数组返回



**总结**

 reduce方法接受两个参数 第一个参数为一个函数 数组循环是的每一个值都会在该方法中被（加工处理），第二个参数是一个初始值（也就是第一个参数的参数的第一个值（第一个参数为函数）是上面的prev）。

------

** 开始手写 **

1.reduce 方法会遍历数组的每一个值。
2.

```js
//语法 array.reduce(function(prev, currentValue, currentIndex, arr), initialValue)
Array.prototype.MyReduce = function(fn, initialValue){
  //浅拷贝数组
  var arr = Array.prototype.slice.call(this);
  //注意: reduce() 对于空数组是不会执行回调函数的。
  if(!arr.length){
      return
  }
  var res;//res(是上面的prev)
  //默认初始值
  res = initialValue ? initialValue : arr[0];
  //遍历数组的每一个值
  for(var i = 0; i < arr.length; i++) {
    //每一个值都会在该方法中被（加工处理），
    res = fn.call(null, res, arr[i], i, this);
  }
  //最后的返回值
  return res
}
```

