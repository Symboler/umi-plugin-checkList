# umi-plugin-checklist

[![NPM version](https://img.shields.io/npm/v/umi-plugin-checklist.svg?style=flat)](https://npmjs.org/package/umi-plugin-checklist)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-checklist.svg?style=flat)](https://npmjs.org/package/umi-plugin-checklist)

frontend checkList
开发环境下，通过InnerDB在ui界面上实现前端组件级的checklist展示及状态更新，支持数据导入导出。(浏览器需支持innerDB)

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: [
    ['umi-plugin-checklist', options],
  ],
}
```
use in react component
```js
import { goodJob } from 'umi-plugin-checklist';

@goodJob(['检查入参'],componentName)   // componentName is not required 
class componentA extends React.Component{
  ...
}
export default componentA

```

## Options

### libraryName: antd、dtd、dtd-loose  ; default : antd

TODO

## LICENSE

MIT
