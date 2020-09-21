# elementui
## 手写elementui---form

​

​       相信大家在使用vue ui库的时候,一定少不了使用form组件，笔者在平时项目中使用的是elementui，所以在使用的时候真心感觉很方便，不过在方便之余，我也看了看form的源码，其中的校验使用的第三方库[async-validator]()，async-validator是一个表单的异步验证的第三方库，它是 [https://github.com/tmpfs/async-validate](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Ftmpfs%2Fasync-validate) 的演变来的。想了解async-validator的可以看   https://www.jianshu.com/p/2105c48b45c7

​		下面我们来了解一下UI库的用法

```html
<el-form :model="formLabelAlign" :rules="rules">
  <el-form-item label="名称">
    <el-input v-model="formLabelAlign.name"></el-input>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-input v-model="formLabelAlign.region"></el-input>
  </el-form-item>
  <el-form-item label="活动形式">
    <el-input v-model="formLabelAlign.type"></el-input>
  </el-form-item>
</el-form>
```

​		首先我们能看到el-form组件中包含el-form-item 那说明el-form组件中至少是这样的

```
// form组件
<div class="myform">
    <slot></slot>
</div>
```

el-form中包含一个slot插槽

el-form 接受两个参数:model="formLabelAlign" :rules="rules"

```
<template>
  <div class="myform">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'myform',
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
    },
  },
};
</script>

```

同理el-form-item的样子

```


<template>
    <div class="formItem">
        // 表单的label
        <span v-if="label" class="label">{{ label }}:</span>
        // 对应的每一个item
        <slot/>
        //对应的错误信息
        <div v-show="errorMessage" class="error">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script>
    import Schema from 'async-validator'
    export default {
        name: 'FormItem',
        props: {
            label: {
                type: String,
                default: ''
            },
            prop: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                errorMessage: ''
            }
        }
    }
</script>

<style scoped lang="scss">
  .formItem{
    display: flex;
    align-items: center;
    margin: 10px;
  }
  .label{
    width: 100px;
  }
  .error{
    color: #ff0000;
  }
</style>

```

​		对于el-input 来说 当值改变后通知父组件

```
<template>
    <div class="myInput">
        <input type="text" @input="input">
    </div>
</template>

<script>

    export default {
        name: 'MyInput',
        data() {
            return {
                msg: 'hello'
            }
        },
        methods: {
            input(e) {
                // 当值发生变化时,通知父组件
                this.$emit('input', e.target.value)
                // 通知el-form-item组件校验
                this.$parent.$emit('doValidate', e.target.value)
            }
        }
    }
</script>

<style scoped lang="scss">
  .myInput{
    margin: 5px 10px;
  }
</style>

```

这样父组件里面就必须包含input，doValidate两个方法了

再回到formItem的样子

```
...

<script>
    import Schema from 'async-validator'
    export default {
        name: 'FormItem',
        ...
        // 这里涉及到provide-inject 可以看vue官网介绍 ttps://cn.vuejs.org/v2/api/#provide-inject
        inject: ['form'],
        mounted() {
            this.$on('doValidate', this.doValidate)
        },
        methods: {
            doValidate() {
                return new Promise((resolve) => {
                    const des = { [this.prop]: this.form.rules[this.prop] }
                    const validate = new Schema(des)
                    validate.validate({ [this.prop]: this.form.model[this.prop] }, (err) => {
                        if (!err) {
                            this.errorMessage = ''
                            resolve(true)
                        } else {
                            this.errorMessage = err[0].message
                            resolve(false)
                        }
                    })
                })
            }
        }
    }
</script>
```

在使用elementui form 的时候触发校验是通过    this.$refs[formName].validate校验是需要知道form里面都包含那个几个组件就是说 formItem注册的时候需要通知form

```
<el-form ref="ruleForm">
submitForm(formName) {
    this.$refs[formName].validate((valid) => {
        if (valid) {
        	alert('submit!');
        } else {
        	console.log('error submit!!');
        	return false;
        }
    });
},
```

所以 form里面应该包含一个校验方法,和包含监听的formItemAdd方法.将formItem放到form的数组中，formitem中需要在mounte的时候通知父组件

```
//form 组件
<template>
  <div class="myform">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'myform',
  created() {
    this.formItemList = [];
    //form里面都包含那个几个组件就是说 formItem注册的时候需要通知form
    this.$on('formItemAdd', this.formItemAdd);
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
    },
  },
  // provide / inject 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。 官网地址 https://cn.vuejs.org/v2/api/#provide-inject
  provide() {
    return {
      form: this,
    };
  },
  data() {
    return {
      msg: 'hello',
    };
  },
  methods: {
    formItemAdd(formItem) {
      this.formItemList.push(formItem);
    },
    // eslint-disable-next-line
    async validate(callback) {
      const res = this.formItemList.map((item)=>{
        return item.doValidate();
      });
      const results = await Promise.all(res);
      let ret = true;
      results.map((result)=>{
        if (!result) {
          ret = false;
        }
      });
      callback(ret);
    }
  }
};
</script>

```

```
// form-item
...

<script>
    import Schema from 'async-validator'
    export default {
        name: 'FormItem',
        ...
        inject: ['form'],
        mounted() {
            this.$on('doValidate', this.doValidate)
            if (this.prop) {
            	// 在form中 存放的是每个formItem 的组件对应
                this.$parent.$emit('formItemAdd', this)
            }
        },
        methods: {
            doValidate() {
                ...
            }
        }
    }
</script>
```

说到 这里form组件基本封装成功了

以下是完成源代码

form.vue

```
<template>
  <div class="myform">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'myform',
  created() {
    this.formItemList = [];
    this.$on('formItemAdd', this.formItemAdd);
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
    },
  },
  provide() {
    return {
      form: this,
    };
  },
  data() {
    return {
      msg: 'hello',
    };
  },
  methods: {
    formItemAdd(formItem) {
      this.formItemList.push(formItem);
    },
    // eslint-disable-next-line
    async validate(callback) {
      const res = this.formItemList.map((item)=>{
        return item.doValidate();
      });
      const results = await Promise.all(res);
      let ret = true;
      results.map((result)=>{
        if (!result) {
          ret = false;
        }
      });
      callback(ret);
    }
  }
};
</script>

```

formItem.vue

```
<template>
    <div class="formItem">
        <span v-if="label" class="label">{{ label }}:</span>
        <slot/>
        <div v-show="errorMessage" class="error">
            {{ errorMessage }}
        </div>
    </div>
</template>
<script>
    import Schema from 'async-validator'
    export default {
        name: 'FormItem',
        components: {},
        props: {
            label: {
                type: String,
                default: ''
            },
            prop: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                errorMessage: ''
            }
        },
        inject: ['form'],
        mounted() {
            this.$on('doValidate', this.doValidate)
            if (this.prop) {
                this.$parent.$emit('formItemAdd', this)
            }
        },
        methods: {
            doValidate() {
                return new Promise((resolve) => {
                    const des = { [this.prop]: this.form.rules[this.prop] }
                    const validate = new Schema(des)
                    validate.validate({ [this.prop]: this.form.model[this.prop] }, (err) => {
                        if (!err) {
                            this.errorMessage = ''
                            resolve(true)
                        } else {
                            this.errorMessage = err[0].message
                            resolve(false)
                        }
                    })
                })
            }
        }
    }
</script>
<style scoped lang="scss">
  .formItem{
    display: flex;
    align-items: center;
    margin: 10px;
  }
  .label{
    width: 100px;
  }
  .error{
    color: #ff0000;
  }
</style>

```

myInput.vue

```
<template>
    <div class="myInput">
        <input type="text" @input="input">
    </div>
</template>
<script>
    export default {
        name: 'MyInput',
        components: {},
        data() {
            return {
                msg: 'hello'
            }
        },
        methods: {
            input(e) {
                this.$emit('input', e.target.value)
                this.$parent.$emit('doValidate', e.target.value)
            }
        }
    }
</script>
<style scoped lang="scss">
  .myInput{
    margin: 5px 10px;
  }
</style>

```

调用 index.vue

```
<template>
    <div class="">
        <my-form ref="myFrom" :model="ruleForm" :rules="rules">
            <my-form-item :label="label.name" prop="name" >
                <my-input v-model="ruleForm.name"/>
            </my-form-item>
            <my-form-item :label="label.password" prop="pwd" >
                <my-input v-model="ruleForm.pwd"/>
            </my-form-item>
            <my-form-item>
                <el-button type="primary" @click="submitForm">登录</el-button>
            </my-form-item>
        </my-form>
    </div>
</template>

<script>
    import myForm from './components/form.vue'
    import myFormItem from './components/my-form-item.vue'
    import myInput from './components/my-input.vue'
    export default {
        name: '',
        components: {
            myForm,
            myFormItem,
            myInput
        },
        data() {
            return {
                label: {
                    name: '用户名',
                    password: '密码'
                },
                ruleForm: {
                    name: 'aa',
                    pwd: ''
                },
                rules: {
                    name: [
                        { required: true, message: '用户名不能为空' },
                        { min: 8, message: '用户名必须大于8个字符' },
                        { max: 16, message: '用户名必须小于16个字符' }
                    ],
                    pwd: [
                        { required: true, message: '密码不能为空' },
                        { min: 8, message: '密码必须大于8个字符' },
                        { max: 16, message: '密码必须小于16个字符' }
                    ]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs.myFrom.validate((ret) => {
                    if (ret === false) {
                        return false
                    } else {
                        this.$message.success('校验通过')
                    }
                })
            }
        }
    }
</script>

```

