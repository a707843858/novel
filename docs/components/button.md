---
title: 按钮
---

# 按钮

常用的操作事件触发元素。

### 尺寸

<n-button size="small">Small</n-button>
<n-button >Normal</n-button>
<n-button size="large">Large</n-button>

```html
<n-button size="mini">Mini</n-button>
<n-button size="small">Small</n-button>
<n-button>Normal</n-button>
<n-button size="large">Large</n-button>
<n-button size="big">Big</n-button>
<n-button size="huge">Huge</n-button>
```

### 主题

<n-button>Default</n-button>
<n-button theme="primary">Primary</n-button>

```html
<n-button>Default</n-button>
<n-button theme="primary">Primary</n-button>
<n-button theme="success">Success</n-button>
<n-button theme="danger">Danger</n-button>
<n-button theme="warning">Warning</n-button>
```

### 类型

Type 的优先级高于 Theme，不可混用。

<n-button theme="primary">Default</n-button>
<n-button theme="primary" type="zoosemy">Zoosemy</n-button>

```html
<n-button theme="primary">Default</n-button>
<n-button theme="primary" type="plain">Plain</n-button>
```

### 禁用

<n-button disabled>Default</n-button>
<n-button theme="primary" disabled>Plain</n-button>
<n-button type="zoosemy" disabled>Dashed</n-button>

```html
<n-button theme="primary" disabled>Default</n-button>
<n-button theme="primary" type="plain" disabled>Plain</n-button>
<n-button theme="primary" type="dashed" disabled>Dashed</n-button>
```

### 加载中

<n-button loading>Loading...</n-button>

```html
<n-button loading>Loading...</n-button>
```

### 图标

<n-button icon="heart" theme="danger">Like</n-button>
<n-button icon="user" type="text" theme="primary">Add</n-button>
<n-button icon="poo" type="dashed">oop</n-button>

```html
<n-button icon="heart">Like</n-button> <n-button icon="user">Add</n-button>poo
<n-button icon="poo">oop</n-button>
```

### Button Api

| 参数     | 说明     | 类型                 | 可选值                                | 默认值 |
| -------- | -------- | -------------------- | ------------------------------------- | ------ |
| size     | 尺寸     | <code>string</code>  | <code>small</code> <code>large</code> | -      |
| theme    | 主题     | <code>string</code>  | <code>primary</code>                  | -      |
| type     | 类型     | <code>string</code>  | <code>zoosemy</code>                  | -      |
| disabled | 禁用     | <code>boolean</code> | -                                     | false  |
| loading  | 加载     | <code>boolean</code> | -                                     | false  |
| icon     | 前置图标 | <code>string</code>  | -                                     | -      |
