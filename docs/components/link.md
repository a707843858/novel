---
title:链接
---

# 链接

一般使用的超链接。

### 主题

<n-link>Default</n-link>
<n-link theme="primary">Primary</n-link>
<n-link theme="success">Success</n-link>
<n-link theme="danger">Danger</n-link>
<n-link theme="warning">Waring</n-link>

```html
<n-link>Default</n-link>
<n-link theme="primary">Primary</n-link>
<n-link theme="success">Success</n-link>
<n-link theme="danger">Danger</n-link>
<n-link theme="warning">Waring</n-link>
```

### 禁用下划线

<n-link disunderline>Default</n-link>
<n-link theme="primary" disunderline>Primary</n-link>
<n-link theme="success" disunderline>Success</n-link>
<n-link theme="danger" disunderline>Danger</n-link>
<n-link theme="warning" disunderline>Waring</n-link>

```html
<n-link disunderline>Default</n-link>
<n-link theme="primary" disunderline>Primary</n-link>
<n-link theme="success" disunderline>Success</n-link>
<n-link theme="danger" disunderline>Danger</n-link>
<n-link theme="warning" disunderline>Waring</n-link>
```

### 禁用

<n-link disabled>Default</n-link>
<n-link theme="primary" disabled>Primary</n-link>
<n-link theme="success" disabled>Success</n-link>
<n-link theme="danger" disabled>Danger</n-link>
<n-link theme="warning" disabled>Waring</n-link>

```html
<n-link disabled>Default</n-link>
<n-link theme="primary" disabled>Primary</n-link>
<n-link theme="success" disabled>Success</n-link>
<n-link theme="danger" disabled>Danger</n-link>
<n-link theme="warning" disabled>Waring</n-link>
```

### 图标

<n-link icon="envelope">Email</n-link>
<n-link theme="primary" icon="solid-user-edit">Edit</n-link>
<n-link theme="warning" icon="solid-eye">Look</n-link>
<n-link theme="danger" icon="solid-eraser">Delete</n-link>

```html
<n-link icon="envelope">Email</n-link>
<n-link theme="primary" icon="solid-user-edit">Edit</n-link>
<n-link theme="warning" icon="solid-eye">Look</n-link>
<n-link theme="danger" icon="solid-eraser">Delete</n-link>
```

### Icon Api

| 参数         | 说明       | 类型                 | 可选值                                                                             | 默认值 |
| ------------ | ---------- | -------------------- | ---------------------------------------------------------------------------------- | ------ |
| theme        | 主题       | <code>string</code>  | <code>primary</code> <code>success</code> <code>warning</code> <code>danger</code> | -      |
| disunderline | 禁用下划线 | <code>boolean</code> | -                                                                                  | false  |
| disabled     | 禁用       | <code>boolean</code> | -                                                                                  | false  |
| icon         | 图标       | <code>string</code>  | -                                                                                  | -      |
