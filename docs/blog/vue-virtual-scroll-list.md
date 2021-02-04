# vue虚拟滚动（vue-virtual-scroll-list）

## 背景

​       在项目中有一个sku表（是一个尺码和颜色乘积的表格），假如有10个颜色，20个尺码，那这个sku表就会有200行。有一个客户有100个颜色的需求，100个颜色的时候如果有5个尺码，就会有500行，这样会使页面很卡，于是找到了vue-virtual-scroll-list这个插件。

## 	    用法

```
<template>
  <div>
    <virtual-list style="height: 360px; overflow-y: auto;" // make list scrollable
      :data-key="'id'"
      :data-sources="items"
      :data-component="itemComponent"
    />
  </div>
</template>

<script>
  import Item from './Item'
  import VirtualList from 'vue-virtual-scroll-list'
 function createData(len) {
     const arr = []
     for (let index = 0; index < len; index++) {
         const obj = { id: index, text: Math.random() }
         arr.push(obj)
     }
     return arr
 }
  export default {
    name: 'root',
    data () {
      return {
        itemComponent: Item,
        items: createData(200)
      }
    },
    components: { 'virtual-list': VirtualList }
  }
</script>
```

```
// item
<template>
  <div>每一行的内容</div>
</template>

<script>
  export default {
    name: 'item-component',
    props: {
      index: { // 每一行的索引
        type: Number
      },
      source: { // 每一行的内容
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>
```

### 参数

| **Prop**         | **Type**         | **Description**                                              |
| ---------------- | ---------------- | ------------------------------------------------------------ |
| `data-key`       | String\|Function | 从`data-sources`每个数据对象中获取唯一键。或每个函数都调用`data-source`并返回其唯一键。在中，其值**必须唯一**`data-sources`，用于标识商品尺寸。 |
| `data-sources`   | Array[Object]    | 列表数据，每一行都必须有一个唯一的id(data-key)               |
| `data-component` | Component        | 每一行的子组件                                               |
| `keeps`          | Number           | 默认30个，默认渲染的个数                                     |
| `extra-props`   | Object | 默认{} data-component组件的额外props通过改属性传入,内部已有source和index两个 |
| `estimate-size` | Number | 默认50，每一行的高度，如果接近平均大小，则滚动条长度看起来会更准确。 |
| `scroll` | 事件 | 滚动时发出param `(event, range)`。 |

剩下的参数  https://www.npmjs.com/package/vue-virtual-scroll-list

## 原理

<img :src="$withBase('/vue-virtual-scroll-list.png')" alt="mixureSecure">

如上图，他只渲染keeps传入的个数，滚动时通过改变padding的值来模拟滚动，里面的每一个item在滚动时动态替换里面的值

核心源码如下
<img :src="$withBase('/vue-virtual-scroll-list原理.png')" alt="mixureSecure">

永远之渲染props的keeps传入的个数，所以这样不会卡
