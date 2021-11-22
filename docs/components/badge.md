---
title:"标记"
---

# 标记

给予元素旁显示数字或文本的小提示。

### 基础用法

<n-badge value="10" >
  <n-button theme="primary">Message</n-button>
</n-badge>
<n-badge value="999" >
  <n-button theme="danger" icon="heart"></n-button>
</n-badge>

```html
<n-badge value="10">
  <n-button theme="primary">Message</n-button>
</n-badge>

<n-badge value="999">
  <n-button theme="danger" icon="heart"></n-button>
</n-badge>
```

### 最大值

<n-badge value="22" >
  <n-button type="plain">评论</n-button>
</n-badge>
<n-badge max="20" value="22" >
  <n-button type="plain">评论</n-button>
</n-badge>

```html
<n-badge value="22">
  <n-button type="plain">评论</n-button>
</n-badge>

<n-badge max="20" value="22">
  <n-button type="plain">评论</n-button>
</n-badge>
```

### 小圆点

<n-badge dot >
  <n-button type="dashed">通知</n-button>
</n-badge>
<n-badge dot >
  <n-button >系统</n-button>
</n-badge>

```html
<n-badge dot>
  <n-button type="dashed">通知</n-button>
</n-badge>

<n-badge dot>
  <n-button >系统</n-button>
</n-badge>
```

### Badge Api

| 参数  | 说明                                                                            | 类型                                    | 可选值 | 默认值 |
| ----- | ------------------------------------------------------------------------------- | --------------------------------------- | ------ | ------ |
| value | 显示文本或者数值                                                                | <code>string</code> <code>number</code> | -      | -      |
| max   | 最大值,当<code>value</code>为数值的时候有效，如果 value 大于 max 则会显示加好。 | <code>number</code>                     | -      | -      |
| dot   | 小圆点,优先于<code>value</code>                                                 | <code>boolean</code>                    | -      | false  |
