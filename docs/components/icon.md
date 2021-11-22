---
title: 图标
---

# 图标

语义化的矢量图形,图标引用于[ Font Awesome V5.15.3 Free ](https://fontawesome.com/),具体图标名称可到官网查阅。

### 名称

<n-icon name="solid-cat" size="20"></n-icon>
<n-icon name="user" size="20"></n-icon>
<n-icon name="brands-github" size="20"></n-icon>
<n-icon name="grin-hearts" size="20"></n-icon>
<n-icon name="heart" size="20"></n-icon>
<n-icon name="kiss-wink-heart" size="20"></n-icon>

```html
<n-icon name="solid-cat"></n-icon>
<n-icon name="user"></n-icon>
<n-icon name="brands-github"></n-icon>
<n-icon name="grin-hearts"></n-icon>
<n-icon name="heart"></n-icon>
<n-icon name="kiss-wink-heart"></n-icon>
```

### 尺寸

<n-icon name="kiss-wink-heart" size="20" ></n-icon>
<n-icon name="kiss-wink-heart" size="30" ></n-icon>
<n-icon name="kiss-wink-heart" size="40" ></n-icon>
<n-icon name="kiss-wink-heart" size="50" ></n-icon>
<n-icon name="kiss-wink-heart" size="60" ></n-icon>

```html
<n-icon name="kiss-wink-heart" size="20"></n-icon>
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

<n-icon name="solid-spinner" size="30" animation="spin" ></n-icon>
<n-icon name="solid-circle-notch" size="30"  animation="spin" ></n-icon>
<n-icon name="solid-sync" size="30"  animation="spin" ></n-icon>
<n-icon name="solid-cog" size="30" animation="spin" ></n-icon>
<n-icon name="solid-spinner" size="30" animation="pulse" ></n-icon>

```html
<n-icon name="solid-spinner" size="30" animation="spin"></n-icon>
<n-icon name="solid-circle-notch" size="30" animation="spin"></n-icon>
<n-icon name="solid-sync" size="30"size="30" animation="spin"></n-icon>
<n-icon name="solid-cog" size="30" animation="spin"></n-icon>
<n-icon name="solid-spinner" size="30" animation="pulse"></n-icon>
```

### 旋转

<n-icon name="solid-snowboarding" size="30" ></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="90" ></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="180" ></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="270" ></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="horizontal" ></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="vertical" ></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="both" ></n-icon>

```html
<n-icon name="solid-snowboarding" size="30"></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="90"></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="180"></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="270"></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="horizontal"></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="vertical"></n-icon>
<n-icon name="solid-snowboarding" size="30" rotate="both"></n-icon>
```

### 路径

该图标库均为 SVG 渲染，同时支持自定义绘制路径，通过 <code>path</code> 传入路径字符串即可，但是需注意此时需配合<code>view</code> 属性设置 SVG <code>viewBox</code>宽高,默认为 50。

<n-icon size="50" path="M40 10H21.76L20 4H8C5.8 4 4 5.8 4 8v26c0 2.2 1.8 4 4 4h14l2 6h16c2.2 0 4-1.8 4-4V14c0-2.2-1.8-4-4-4zM14.33 29.17c-4.51 0-8.17-3.67-8.17-8.17s3.67-8.17 8.17-8.17c2.08 0 3.97.74 5.47 2.13l.13.13-2.44 2.36-.12-.11c-.57-.54-1.56-1.17-3.04-1.17-2.62 0-4.75 2.17-4.75 4.84s2.13 4.84 4.75 4.84c2.74 0 3.93-1.75 4.25-2.92h-4.42v-3.1h7.9l.03.14c.08.42.11.79.11 1.21-.01 4.71-3.24 7.99-7.87 7.99zm12.07-3.4c.67 1.2 1.48 2.35 2.38 3.4l-1.07 1.06-1.31-4.46zm1.54-1.54h-1.98l-.61-2.08h7.99s-.68 2.63-3.12 5.47c-1.07-1.23-1.81-2.43-2.28-3.39zM42 40c0 1.1-.9 2-2 2H26l4-4-1.63-5.53 1.84-1.84L35.58 36l1.46-1.46-5.41-5.37c1.8-2.07 3.2-4.5 3.83-7.01H38v-2.08h-7.27V18h-2.08v2.08h-3.92L22.35 12H40c1.1 0 2 .9 2 2v26z"></n-icon>

```html
<n-icon
  size="50"
  path="M40 10H21.76L20 4H8C5.8 4 4 5.8 4 8v26c0 2.2 1.8 4 4 4h14l2 6h16c2.2 0 4-1.8 4-4V14c0-2.2-1.8-4-4-4zM14.33 29.17c-4.51 0-8.17-3.67-8.17-8.17s3.67-8.17 8.17-8.17c2.08 0 3.97.74 5.47 2.13l.13.13-2.44 2.36-.12-.11c-.57-.54-1.56-1.17-3.04-1.17-2.62 0-4.75 2.17-4.75 4.84s2.13 4.84 4.75 4.84c2.74 0 3.93-1.75 4.25-2.92h-4.42v-3.1h7.9l.03.14c.08.42.11.79.11 1.21-.01 4.71-3.24 7.99-7.87 7.99zm12.07-3.4c.67 1.2 1.48 2.35 2.38 3.4l-1.07 1.06-1.31-4.46zm1.54-1.54h-1.98l-.61-2.08h7.99s-.68 2.63-3.12 5.47c-1.07-1.23-1.81-2.43-2.28-3.39zM42 40c0 1.1-.9 2-2 2H26l4-4-1.63-5.53 1.84-1.84L35.58 36l1.46-1.46-5.41-5.37c1.8-2.07 3.2-4.5 3.83-7.01H38v-2.08h-7.27V18h-2.08v2.08h-3.92L22.35 12H40c1.1 0 2 .9 2 2v26z"
></n-icon>
```

### Icon Api

| 参数      | 说明                                                                                                                              | 类型                                    | 可选值                                                                                                            | 默认值 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ |
| name      | 名称,格式为：<code>类型-名字</code>,类型有 <code>regular</code> <code>brands</code> <code>solid</code> ,其中 regular 类可以省略。 | <code>string</code>                     | [ 点击查阅 Icons ](https://fontawesome.com/icons?d=gallery&p=2)                                       | -      |
| size      | 尺寸,入参为数字的时候默认单位为 px,字符串格式请带单位。                                                                           | <code>string</code> <code>number</code> | -                                                                                                                 | 14px   |
| color     | 颜色，可传入颜色值。                                                                                                              | <code>string</code>                     | -                                                                                                                 | -      |
| animation | 动画                                                                                                                              | <code>string</code>                     | <code>spin</code> <code>pulse</code>                                                                              | -      |
| rotate    | 旋转                                                                                                                              | <code>string</code>                     | <code>90</code> <code>180</code> <code>270</code> <code>horizontal</code> <code>vertical</code> <code>both</code> | -      |
| path      | 路径,需配合传入 <code>view</code> 属性设置 SVG 的 <code>viewBox</code> 属性                                                       | <code>string</code>                     | -                                                                                                                 | -      |
| view      | 相当于 svg 的 viewBox 的宽高属性，仅 <code>path</code> 存在的时候生效。                                                                                                | <code>string<code>                      | -                                                                                                                 | -      |
