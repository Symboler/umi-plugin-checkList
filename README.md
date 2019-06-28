# umi-plugin-checklist

[![NPM version](https://img.shields.io/npm/v/umi-plugin-checklist.svg?style=flat)](https://npmjs.org/package/umi-plugin-checklist)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-checklist.svg?style=flat)](https://npmjs.org/package/umi-plugin-checklist)

frontend checkList

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: [
    ['umi-plugin-checkList', options],
  ],
}
```
use in react component
```js
import { goodJob } from 'umi';

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
