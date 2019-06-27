import React, { Component } from 'react';

const isDev = process.env.NODE_ENV === 'development';

let db = false;
function initDb() {
  let request = false;
  if (!window.indexedDB) {
    console.warn(
      "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
    );
    return;
  }
  request = window.indexedDB.open('checkList_db');
  request.onerror = function error() {
    console.log('数据库打开报错');
  };
  request.onsuccess = function success() {
    db = request.result; // 可以拿到数据库对象
    console.log('数据库打开成功');
  };
  // //如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
  request.onupgradeneeded = function onupgradeneeded(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('checkList_table')) {
      // 判断是否存在
      db.createObjectStore('checkList_table', { keyPath: 'path' });
    }
  };
}

if (isDev) {
  initDb();
}

/**
 * 更新数据库数据
 * @param {*} param0
 * @param {*} callback
 */

export function check_update({ path, checkList }, callback) {
    const request = db
      .transaction(['checkList_table'], 'readwrite')
      .objectStore('checkList_table')
      .put({ path, checkList });
    request.onsuccess = function success() {
      console.log('数据更新成功');
      if (callback) {
        callback(checkList);
      }
    };
  
    request.onerror = function error() {
      console.log('数据更新失败');
    };
  }

/**
 * 复选框change事件
 * @param {*} e
 * @param {*} param1
 */

export function check_onCheckChange(e, { prevCheckList, currentCheckList, key, label }) {
  const nextState = { ...currentCheckList };
  nextState[key][label] = !!e.target.checked;
  const { pathname: path } = window.location;
  check_update({ path, checkList: { ...prevCheckList, ...currentCheckList } });
}


/**
 * 读取所有数据
 */

function readAll(callback) {
  const objectStore = db.transaction('checkList_table').objectStore('checkList_table');
  const data = [];
  objectStore.openCursor().onsuccess = function success(event) {
    const cursor = event.target.result;
    if (cursor) {
      data.push(cursor.value);

      cursor.continue();
    } else if (callback) {
      callback(data);
    }
  };
}


/**
 * 导出数据
 */

function funDownload(data) {
    const eleLink = document.createElement('a');
    eleLink.download = 'checkList.json';
    eleLink.style.display = 'none';
  
    // 字符内容转变成blob地址
    const blob = new Blob([JSON.stringify(data)]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }

// 导出数据
export function check_export(){
    readAll(funDownload)
}

// 重置数据
export function check_resetData(callback){
    const request =  db.transaction(['checkList_table'], 'readwrite')
    .objectStore('checkList_table')
    .clear()
    request.onsuccess = function success() {
        console.warn('删除数据成功')
        if(callback){
            callback() 
        }
      };
      request.onerror = function success() {
       console.warn('删除数据失败')
      };
}

// 导入数据
export function check_importData(file,callback) {
  if (window.FileReader) {
    const fr = new FileReader();
    /* eslint-disable */
    fr.onloadend = function(e) {
        let content
        try {
            content = JSON.parse(e.target.result)
        } catch (error) {
            console.warn(error)
        }
        if(content){
            const request =  db.transaction(['checkList_table'], 'readwrite')
            .objectStore('checkList_table')
            .clear()
            request.onsuccess = function success() {
                console.log('数据删除成功,开始导入新的数据...');
                content.map((data)=>{
                add(data);
                })
                // TODO 处理异步回调，暂时用定时器来处理,可以考虑用全局状态来管理
                if(callback){
                    callback()
                }
              };
           
        }
    };
    fr.readAsText(file);
  }else{
      alert('浏览器不支持FileReader，无法导入数据')
  }
}


/**
 * 弹框展示checkList状态
 * @param {*} param0
 * @param {*} checkList
 */
export function check_showModal(callback) {

const {pathname} = window.location
  const request = db
  .transaction(['checkList_table'], 'readonly')
  .objectStore('checkList_table')
  .get(pathname);

request.onerror = function error() {
  console.warn('获取checkList失败');
};
request.onsuccess = function success() {
    if(callback){
        callback(request.result)
    }
  };
}

/**
 * 删除表数据
 * @param {*删除数据的主键，取页面的pathname} path
 */
export function remove(path) {
  const request = db
    .transaction(['checkList_table'], 'readwrite')
    .objectStore('checkList_table')
    .delete(path);

  request.onsuccess = function success() {
    console.log('数据删除成功');
  };
}

/**
 *
 * @param {*数据主键（页面pathname）和 checkList集合} param0
 * @param {*新增数据后的回调函数} callback
 */
function add({ path, checkList }, callback) {
  const request = db
    .transaction(['checkList_table'], 'readwrite')
    .objectStore('checkList_table')
    .add({ path, checkList });

  request.onsuccess = function success() {
    console.log('数据写入成功');
    if (callback) {
      callback(checkList);
    }
  };

  request.onerror = function error() {
    console.log('数据写入失败');
  };
}

/**
 * 检查并更新checkList
 * @param {*path是页面的pathname，checkListForComponent:组件的checkList集合，componentName组件的名称} param0
 */
function checkAndUpdate({ path, checkListForComponent, componentName }) {
  const request = db
    .transaction(['checkList_table'], 'readonly')
    .objectStore('checkList_table')
    .get(path);

  request.onerror = function error() {
    console.log('获取checkList失败');
  };

  request.onsuccess = function success() {
    if (request.result) {
      const { checkList } = request.result;
      const prevCheckList = checkList[componentName];
      const currentCheckList = checkListForComponent[componentName];
      if (!prevCheckList) {
        check_update(
          { path, checkList: { ...checkList, ...checkListForComponent } }
        );
      } else {
        const newList = [
          ...new Set(Object.keys(prevCheckList).concat(Object.keys(currentCheckList))),
        ];
        const nextCheckList = {};
        nextCheckList[componentName] = {};
        if (newList.length > 0) {
          newList.forEach(v => {
            if (v in currentCheckList) {
              nextCheckList[componentName][v] = prevCheckList[v] || currentCheckList[v] || false;
            }
          });
        }
        check_update(
          { path, checkList: { ...checkList, ...nextCheckList } }
        );
      }
    } else {
      console.log('未获得数据记录');
      add({ path, checkList: checkListForComponent });
    }
  };
}

/**
 * 给公共组件绑定checkList
 * @param {公共组件的checkList} checkList
 */
export function goodJob(checkList,customName) {
  if (isDev) {
    /* eslint-disable */
    return function(WrappedComponent) {
      return class extends Component {
        componentDidMount() {
          const { displayName,name } = WrappedComponent;
          const tagName = customName || displayName||name
          const checkListForComponent = transformCheckList(tagName, checkList);
          if (checkListForComponent) {
            const { pathname } = window.location;
            checkAndUpdate({ path: pathname, checkListForComponent, componentName: tagName });
          }
        }
        
        render() {
          return <WrappedComponent {...this.props} />;
        }
      };
    };
  }
  return function() {};
}


function transformCheckList(name, checkList = []) {
  if (!name) {
    console.error('component name is required');
    return false;
  }
  if (!Array.isArray(checkList)) {
    console.error('checkList must be array');
    return false;
  }
  let newList = {};
  checkList.forEach(item => {
    if (typeof item !== 'string') {
      console.error('checkList item must be string');
    } else {
      newList[item] = false;
    }
  });
  return { [name]: newList };
}
