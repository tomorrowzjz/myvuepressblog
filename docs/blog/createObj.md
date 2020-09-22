## 使用Object 构造函数创建对象
    var person = new Object();
    person.name = 'zs';
    person.age = 19;
    person.sayName = function(){
        console.log(this.name);
    }
## 使用对象字面量创建对象
    var person = {
        name:'zs',
        age:19,
        sayName:function(){
            console.log(this.name);
        }
    }
虽然 Object 构造函数或对象字面量都可以用来创建单个对象，但这些方式有个明显的缺点：使用同一个接口创建很多对象，会产生大量的重复代码。所以工厂模式应用而生。

```js
function createPerson(name,age){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.sayName = function(){
        console.log(this.name);
   }
   return o;
}
var person1 = createPerson('zs',19);
var person2 = createPerson('li',20);
```


​
## 构造函数模式
 ```
    function Person(name, age, job){
     this.name = name;
     this.age = age;
     this.job = job;
     this.sayName = function(){
     alert(this.name);
     };
    }
    var person1 = new Person("Nicholas", 29, "Software Engineer");
    var person2 = new Person("Greg", 27, "Doctor");
 ```

> 要创建 Person 的新实例，必须使用 new 操作符。以这种方式调用构造函数实际上会经历以下 4个步骤：
(1) 创建一个新对象；
(2) 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
(3) 执行构造函数中的代码（为这个新对象添加属性）；
(4) 返回新对象。

```
alert(person1.constructor == Person); //true
alert(person2.constructor == Person); //true
```



> 提到检测对象类型，还是 instanceof 操作符要更可靠一些。
```
alert(person1 instanceof Object); //true
alert(person1 instanceof Person); //true
alert(person2 instanceof Object); //true
alert(person2 instanceof Person); //true
```


> 创建自定义的构造函数意味着将来可以将它的实例标识为一种特定的类型；
```
    // 当作构造函数使用
    var person = new Person("Nicholas", 29, "Software Engineer");
    person.sayName(); //"Nicholas"
    // 作为普通函数调用
    Person("Greg", 27, "Doctor"); // 添加到 window
    window.sayName(); //"Greg"
    // 在另一个对象的作用域中调用
    var o = new Object();
    Person.call(o, "Kristen", 25, "Nurse");
    o.sayName(); //"Kristen"
```
> 构造函数模式虽然好用，但也并非没有缺点。使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。因此，大可像下面这样，通过把函数定义转移到构造函数外部来解决这个问题。

```
function Person(name, age, job){
this.name = name;
this.age = age;
this.job = job;
this.sayName = sayName;
}
function sayName(){
alert(this.name);
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```


如果对象需要定义很多方法，那么就要定义很多个全局函数，于是我们这个自定义的引用类型就丝毫没有封装性可言了。

## 原型模式
```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
alert(this.name);
};
var person1 = new Person();
person1.sayName(); //"Nicholas"
var person2 = new Person();
person2.sayName(); //"Nicholas"
alert(person1.sayName == person2.sayName); //true
```


## isPrototypeOf()
```
alert(Person.prototype.isPrototypeOf(person1)); //true
alert(Person.prototype.isPrototypeOf(person2)); //true
```


## ECMAScript 5 增加了一个新方法，叫 Object.getPrototypeOf()

```
alert(Object.getPrototypeOf(person1) == Person.prototype); //true
alert(Object.getPrototypeOf(person1).name); //"Nicholas"
```



> 使用 hasOwnProperty()方法可以检测一个属性是存在于实例中，还是存在于原型中。只在给定属性存在于对象实例中时，才会返回 true。
> 有两种方式使用 in 操作符：单独使用和在 for-in 循环中使用。在单独使用时，in 操作符会在通过对象能够访问给定属性时返回 true，无论该属性存在于实例中还是原型中。

```
alert(person1.hasOwnProperty("name")); //false
alert("name" in person1); //true
//该方法可以确定该属性到底是存在于对象中，还是存在于原型中
function hasPrototypeProperty(object, name){
return !object.hasOwnProperty(name) && (name in object);
}
```



  ## 原型对象的问题
  // 对于包含引用类型值的属性来说，一个对象改变了friends另一个对象会跟着改变
  ```
  function Person(){
  }
  Person.prototype = {
    constructor: Person,
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    friends : ["Shelby", "Court"],
    sayName : function () {
    alert(this.name);
    }
  };
  var person1 = new Person();
  var person2 = new Person();
  person1.friends.push("Van");
  alert(person1.friends); //"Shelby,Court,Van"
  alert(person2.friends); //"Shelby,Court,Van"
  alert(person1.friends === person2.friends); //true
  ```
## 组合使用构造函数模式和原型模式
