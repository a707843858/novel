---
title: 按钮
---

# 按钮

常用的操作事件触发元素。

### 尺寸

<n-button size="mini">Mini</n-button>
<n-button size="small">Small</n-button>
<n-button >Normal</n-button>
<n-button size="large">Large</n-button>
<n-button size="big">Big</n-button>
<n-button size="huge">Huge</n-button>

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
<n-button theme="success">Success</n-button>
<n-button theme="danger">Danger</n-button>
<n-button theme="warning">Warning</n-button>

```html
<n-button>Default</n-button>
<n-button theme="primary">Primary</n-button>
<n-button theme="success">Success</n-button>
<n-button theme="danger">Danger</n-button>
<n-button theme="warning">Warning</n-button>
```

### 类型

<n-button theme="primary">Default</n-button>
<n-button theme="primary" type="plain">Plain</n-button>
<n-button theme="primary" type="dashed">Dashed</n-button>
<n-button theme="primary" type="text">Text</n-button>

```html
<n-button theme="primary">Default</n-button>
<n-button theme="primary" type="plain">Plain</n-button>
<n-button theme="primary" type="dashed">Dashed</n-button>
<n-button theme="primary" type="text">Text</n-button>
```

### 禁用

使用点击事件的时候需要判断 <code>disabled</code> 是否为真来判断是否禁用。

<n-button theme="primary" disabled>Default</n-button>
<n-button theme="primary" type="plain" disabled>Plain</n-button>
<n-button theme="primary" type="dashed" disabled>Dashed</n-button>
<n-button theme="primary" type="text" disabled>Text</n-button>

```html
<n-button theme="primary" disabled>Default</n-button>
<n-button theme="primary" type="plain" disabled>Plain</n-button>
<n-button theme="primary" type="dashed" disabled>Dashed</n-button>
<n-button theme="primary" type="text" disabled>Text</n-button>
```

### 加载中

<n-button loading>Loading...</n-button>

```html
<n-button loading>Loading...</n-button>
```

### 图标

<n-button icon="heart" theme="danger">Like</n-button>
<n-button icon="solid-user-plus" type="text" theme="primary">Add</n-button>
<n-button icon="solid-poo" type="dashed">oop</n-button>

```html
<n-button icon="heart">Like</n-button>
<n-button icon="solid-user-plus" >Add</n-button>poo
<n-button icon="solid-poo">oop</n-button>
```

### Button Api

| 参数     | 说明     | 类型                 | 可选值                                                                                     | 默认值 |
| -------- | -------- | -------------------- | ------------------------------------------------------------------------------------------ | ------ |
| size     | 尺寸     | <code>string</code>  | <code>mini</code> <code>small</code> <code>large</code> <code>big</code> <code>huge</code> | -      |
| theme    | 主题     | <code>string</code>  | <code>primary</code> <code>success</code> <code>warning</code> <code>danger</code>         | -      |
| type     | 类型     | <code>string</code>  | <code>plain</code> <code>dashed</code> <code>text</code>                                   | -      |
| disabled | 禁用     | <code>boolean</code> | -                                                                                          | false  |
| loading  | 加载     | <code>boolean</code> | -                                                                                          | false  |
| icon     | 前置图标 | <code>string</code>  | -                                                                                          | false  |
