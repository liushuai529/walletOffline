import RNFS from 'react-native-fs';



/** @namespace RNFS.ExternalDirectoryPath */
/**
 * 常用文件存储目录(ios与android)
 *
 * RNFS.MainBundlePath
 * RNFS.CachesDirectoryPath
 * RNFS.DocumentDirectoryPath
 * RNFS.TemporaryDirectoryPath
 * RNFS.LibraryDirectoryPath
 * RNFS.ExternalDirectoryPath
 * RNFS.ExternalStorageDirectoryPath

 */

const DocumentDirectoryPath = RNFS.DocumentDirectoryPath;
const ExternalDirectoryPath = RNFS.ExternalDirectoryPath; 

/**
 * 功能描述: <br>
 * 〈文件下载(图片、文件、音频、视频)〉
 *
 * @MethodName: _downloadFile
 * @Author: demon
 * @Version: 1.0.0
 * @Date: 2019/10/17 14:46
 * @Param: [formUrl 要下载的文件地址, targetName 目标文件名称(类似text.txt),callback: 1：下载成功   0：下载失败]
 *
 */
export const _downloadFile = (formUrl, uid, roomId, targetName,callback, beginCallback, progressCallback) => {
    // 获取下载文件本地保存路径

    const toLoadPath = `${DocumentDirectoryPath}/${uid}/${roomId}/${targetName}`;
    console.log(formUrl, '下载链接')
    console.log(toLoadPath,'下载地址')
    RNFS.downloadFile({
        fromUrl: formUrl,
        toFile: toLoadPath,
        progressDivider: 5,
        begin: (res) => beginCallback(res),
        progress: (res) =>  progressCallback(res)
    })
    .promise.then(()=>callback(1))
    		.catch(()=> callback(0));
};

export const _downloadFileApk = (formUrl, callback, beginCallback, progressCallback) => {
  // 获取下载文件本地保存路径

  const toloadpath = `${ExternalDirectoryPath}/tv.apk`;
  RNFS.downloadFile({
      fromUrl: formUrl,
      toFile: toloadpath,
      progressDivider: 5,
      begin: (res) => beginCallback(res),
      progress: (res) =>  progressCallback(res)
  })
  .promise.then(()=>callback(1))
      .catch(()=> callback(0));
};

export const _fileExApk = (callback) => {

  RNFS.exists(`${CachesDirectoryPath}/tv.apk`)

      .then((result) => callback(result))
};


/**
 * 功能描述: <br>
 * 〈
 * 判断文件是否存在  文件存在返回:true  不存在返回:false
 * 〉
 *
 * @MethodName: _fileEx
 * @Author: demon
 * @Version: 1.0.0
 * @Date: 2019/10/17 15:30
 * @Param: [filePath文件路径    callback:回调函数]
 *
 */

export const _fileEx = (fileName, uid, roomId, callback) => {

  RNFS.exists(`${DocumentDirectoryPath}/${uid}/${roomId}/${fileName}`)

      .then((result) => callback(result))
};


export const  _allFileEx =  function (attachment, uid, roomId ,callback) {  
  var obj = {}
  attachment.forEach(async (item, index) => {
    let fileName = item.url.substring(item.url.lastIndexOf('/')+1,item.url.length)
    let fileFullName = item.url.substring(item.url.lastIndexOf('/')+1,item.url.length)+'.'+item.type.toUpperCase();
    let result = await RNFS.exists(`${DocumentDirectoryPath}/${uid}/${roomId}/${fileFullName}`)
    obj[fileName] = result
    if(index === attachment.length-1) {
      callback(obj);
    }
  })
}








export const _folderEx = (uid, roomId, callback) => {
  RNFS.exists(`${DocumentDirectoryPath}/${uid}/${roomId}`)

      .then((result) => callback(result))
};


/**
 * 功能描述: <br>
 * 〈
 * 创建Android目录
 * 〉
 *
 * @MethodName: _mkdir
 * @Author: demon
 * @Version: 1.0.0
 * @Date: 2019/10/17 17:08
 * @Param: [path:要创建的文件夹路径【file:///sacard/AXX/files】  callback: 1:创建成功  0/其它:创建失败]
 *
 */
export function _mkdir(uid, roomId, callback) {
  RNFS.mkdir(`${DocumentDirectoryPath}/${uid}/${roomId}`)
      .then((result) => callback(result))
}


/**
 * 功能描述: <br>
 * 〈将内容写入本地文本〉
 *
 * @MethodName: _writeFile
 * @Author: demon
 * @Version: 1.0.0
 * @Date: 2019/10/17 14:47
 * @Param: [ targetName 目标文件名称(类似text.txt)  content 文本内容   callback: 1：成功 ]
 *
 */
export const _writeFile = (targetName,content, callback) => {
    const path = `${DocumentDirectoryPath}/${targetName}`;
    RNFS.writeFile(path, content, 'utf8')
        .then(result => callback(1));
};


/**
 * 功能描述: <br>
 * 〈读取文本内容〉
 *
 * @MethodName: _readFile
 * @Author: demon
 * @Version: 1.0.0
 * @Date: 2019/10/17 14:48
 * @Param: [fileName 文件名称，callback 回调函数获得读取的文件内容]
 *
 */
export const _readFile = (fileName, uid, roomId, callback) => {
  RNFS.readDir(`${DocumentDirectoryPath}/${uid}/${roomId}`) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
    console.log('GOT RESULT', result);

    // stat the first file
    return Promise.all([RNFS.stat(`${DocumentDirectoryPath}/${uid}/${roomId}/${fileName}`), `${DocumentDirectoryPath}/${uid}/${roomId}/${fileName}`]);
  })
  .then((statResult) => {
    if (statResult[0].isFile()) {
      // if we have a file, read it
      return RNFS.readFile(statResult[1], 'utf8');
    }

    return 'no file';
  })
  .then((contents) => {
    // log the file contents
    console.log(contents);
    callback(contents)
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });
};




/**
 * 功能描述: <br>
 * 〈在已有的txt上添加新的文本〉
 *
 * @MethodName: _appendFile
 * @Author: demon
 * @Version: 1.0.0
 * @Date: 2019/10/17 14:49
 * @Param: [fileName:要追加的目标文本名称, content 要添加的文本信息, callback:回调函数   1：成功]
 *
 */
export const _appendFile = (fileName, content, callback) => {
     RNFS.appendFile(`${DocumentDirectoryPath}/${fileName}`, content, 'utf8')
        .then(()=>callback(1));
};

/**
 * 功能描述: <br>
 * 〈删除本地文件〉
 *
 * @MethodName: _deleteFile
 * @Author: demon
 * @Version: 1.0.0
 * @Date: 2019/10/17 14:49
 * @Param: targetName 要删除的文件名称   callback:回调函数   1：成功  0/其它:失败
 *
 */
export const _deleteFile = (targetName,callback)=> {
     RNFS.unlink(`${DocumentDirectoryPath}/${targetName}`)
        .then(()=> callback(1));
};



