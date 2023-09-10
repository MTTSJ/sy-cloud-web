/**
 * 生成缩略图
 * @param src 资源地址
 * @param config 配置项
 * @returns {Promise<File, String>}
 */
export default function generateThumb(src, config) {
  const promise = new Promise(resolve => {
    const { ratio, maxWidth, maxHeight, fileName, fileType } = config;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 创建媒体对象
    const media = createMedia(fileType);
    // 绘图
    const drawImg = function() {
      const originSize = getMediaSize(media, fileType);
      const size = calculateZoomSize(originSize[0], originSize[1], { ratio, maxWidth, maxHeight });
      const w = size[0];
      const h = size[1];
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(media, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/png');
      const blob = dataURLtoBlob(dataUrl);
      const names = fileName.split('.');
      names.splice(1, 0, '-thum', '.');
      const file = blobToFile(blob, names.join(''));
      clearMedia(media, fileType);
      resolve(file, dataUrl);
    };
    // 添加监听事件，启动绘图
    if (fileType === 'image') {
      media.onload = drawImg;
    } else if (fileType === 'video') {
      media.addEventListener('timeupdate', drawImg);
    }
    // 设置媒体对象数据源
    media.src = src;
  });
  return promise;
}

/**
 * 获取媒体文件原始尺寸
 * @param media
 * @param fileType
 * @returns {null|*[]|number[]}
 */
function getMediaSize(media, fileType) {
  if (fileType === 'image') {
    return [media.width, media.height];
  } else if (fileType === 'video') {
    return [media.videoWidth, media.videoHeight];
  }
  return null;
}

/**
 * 创建媒体对象
 * @param fileType 文件类型
 * @returns {HTMLVideoElement|HTMLImageElement|Image}
 */
function createMedia(fileType) {
  if (fileType === 'video') {
    return createVideo();
  } else if (fileType === 'image') {
    return createImage();
  }
}

/**
 * 创建视频
 * @returns {HTMLVideoElement}
 */
function createVideo() {
  const video = document.createElement('video');
  video.style = 'display: none';
  video.addEventListener('loadeddata', () => {
    video.currentTime = video.duration <= 2 ? video.duration : 2;
  });
  document.querySelector('body').appendChild(video);
  return video;
}

/**
 * 创建图像
 * @returns {HTMLImageElement}
 */
function createImage() {
  return new Image();
}

/**
 * 清除媒体对象
 * @param media
 * @param fileType
 */
function clearMedia(media, fileType) {
  if (fileType === 'video') {
    document.querySelector('body').removeChild(media);
  } else if (fileType === 'image') {
    media = null;
  }
}

/**
 * dataUrl 数据 转 blob
 * @param dataUrl
 * @returns {Blob}
 */
function dataURLtoBlob(dataUrl) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * blob 数据转 file
 * @param theBlob
 * @param fileName
 * @returns {*}
 */
function blobToFile(blob, fileName) {
  blob.lastModifiedDate = new Date();
  return new File([blob], fileName);
}

/**
 * 计算图像缩放后的尺寸
 * @param originWidth 原始宽度
 * @param originHeight 原始高度
 * @param ratio 缩放比率 (如果设置了此项，则最大宽度和最大高度设置不生效)
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @returns {number[]}
 */
function calculateZoomSize(originWidth, originHeight, config) {
  const { ratio, maxWidth, maxHeight } = config;
  let w = 0;
  let h = 0;
  if (ratio !== undefined) {
    w = Math.ceil(originWidth * ratio);
    h = Math.ceil(originHeight * ratio);
  } else if (maxWidth !== undefined && maxHeight === undefined) {
    w = maxWidth;
    const r = maxWidth / originWidth;
    h = Math.ceil(originHeight * r);
  } else if (maxWidth === undefined && maxHeight !== undefined) {
    h = maxHeight;
    const r = maxHeight / originHeight;
    w = Math.ceil(this.width * r);
  } else if (maxWidth !== undefined && maxHeight !== undefined) {
    const wr = maxWidth / originWidth;
    const hr = maxHeight / originHeight;
    const r = Math.min(wr, hr);
    w = Math.ceil(originWidth * r);
    h = Math.ceil(originHeight * r);
  } else { // 未设置长宽限制时，默认宽高不超200
    const wr = 200 / originWidth;
    const hr = 200 / originHeight;
    const r = Math.min(wr, hr);
    w = Math.ceil(originWidth * r);
    h = Math.ceil(originHeight * r);
  }
  return [w, h];
}
