// ref:
// - https://umijs.org/plugin/develop.html
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import Mustache from 'mustache';
const isDev = process.env.NODE_ENV === 'development';

export default (api, options={}) => {
  const { paths } = api;
  if(!isDev){
    return 
  }
  const { libraryName = 'antd' } = options;
  if (!['antd', 'dtd', 'dtd-loose'].includes(libraryName)) {
    console.error('this plugin only support antd,dtd,or dtd-loose');
    return;
  }
  api.addRendererWrapperWithComponent(() => {
    const wrapperTpl = readFileSync(join(__dirname, '../template/wrapper.jsx.tpl'), 'utf-8');
    const wrapperContent = Mustache.render(wrapperTpl, {
      libraryName,
    });
    const wrapperPath = join(paths.absTmpDirPath, './checkList.jsx');
    writeFileSync(wrapperPath, wrapperContent, 'utf-8');
    return wrapperPath;
  });
};
