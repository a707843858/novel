---
title: 图标
---

# 图标

语义化的矢量图形,图标引用于[ Font Awesome 6.0.0-beta3-free ](https://fontawesome.com/),具体图标名称可到官网查阅。

## 代码演示

### 名称

<n-icon name="cat" size="20"></n-icon>
<n-icon name="user" size="20"></n-icon>
<n-icon name="github_brands" size="20"></n-icon>
<n-icon name="grin-hearts" size="20"></n-icon>
<n-icon name="heart" size="20"></n-icon>
<n-icon name="kiss-wink-heart" size="20"></n-icon>

```html
<n-icon name="cat" size="20"></n-icon>
<n-icon name="user" size="20"></n-icon>
<n-icon name="github_brands" size="20"></n-icon>
<n-icon name="grin-hearts" size="20"></n-icon>
<n-icon name="heart" size="20"></n-icon>
<n-icon name="kiss-wink-heart" size="20"></n-icon>
```

### 尺寸

<n-icon name="kiss-wink-heart" ></n-icon>
<n-icon name="kiss-wink-heart" size="30" ></n-icon>
<n-icon name="kiss-wink-heart" size="40" ></n-icon>
<n-icon name="kiss-wink-heart" size="50" ></n-icon>
<n-icon name="kiss-wink-heart" size="60" ></n-icon>

```html
<n-icon name="kiss-wink-heart"></n-icon>
<n-icon name="kiss-wink-heart" size="30"></n-icon>
<n-icon name="kiss-wink-heart" size="40"></n-icon>
<n-icon name="kiss-wink-heart" size="50"></n-icon>
<n-icon name="kiss-wink-heart" size="60"></n-icon>
```

### 颜色

<n-icon name="heart" size="30"  color="red"></n-icon>
<n-icon name="heart" size="30" color="orange"></n-icon>
<n-icon name="heart" size="30"  color="yellow"></n-icon>
<n-icon name="heart" size="30" color="green"></n-icon>
<n-icon name="heart" size="30" color="blue"></n-icon>

```html
<n-icon name="heart" size="30" color="red"></n-icon>
<n-icon name="heart" size="30" color="orange"></n-icon>
<n-icon name="heart" size="30" color="yellow"></n-icon>
<n-icon name="heart" size="30" color="green"></n-icon>
<n-icon name="heart" size="30" color="blue"></n-icon>
```

### 动画

<n-icon name="circle-notch" size="30" animation="spin" ></n-icon>
<n-icon name="heart" size="30"  animation="beat" ></n-icon>
<n-icon name="compact-disc" size="30"  animation="flip" ></n-icon>
<n-icon name="poo-bolt" size="30" animation="beat-fade" ></n-icon>
<n-icon name="triangle-exclamation" size="30" animation="fade" ></n-icon>

```html
<n-icon name="circle-notch" size="30" animation="spin"></n-icon>
<n-icon name="heart" size="30" animation="beat"></n-icon>
<n-icon name="compact-disc" size="30" animation="flip"></n-icon>
<n-icon name="poo-bolt" size="30" animation="beat-fade"></n-icon>
<n-icon name="triangle-exclamation" size="30" animation="fade"></n-icon>
```

## Api

### Icon

| 参数      | 说明                                                                                                                             | 类型                                    | 可选值                                                                                         | 默认值 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| name      | 名称,格式为：<code>名字\_类型</code>,类型有 <code>regular</code> <code>brands</code> <code>solid</code> ,其中 solid 类可以省略。 | <code>string</code>                     | [ 点击查阅 Icons ](https://fontawesome.com/icons?d=gallery&p=2)                                | -      |
| size      | 尺寸,入参为数字的时候默认单位为 px,字符串格式请带单位。                                                                          | <code>string</code> <code>number</code> | -                                                                                              | 20px   |
| color     | 颜色，可传入颜色值。                                                                                                             | <code>string</code>                     | -                                                                                              | -      |
| animation | 动画                                                                                                                             | <code>string</code>                     | <code>spin</code> <code>beat</code> <code>flip</code> <code>beat-fade</code> <code>fade</code> | -      |

|
