/*
  From https://github.com/webpack-contrib/style-loader/blob/master/lib/addStyles.js with modifications.
  MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
 */

const caches = {};
const transformStyles = [];
const transformIds = [];

// Transform item that genreated by loader to style object
export default function listToStyles(cssModule, options = {}) {
  const transformStyle = options.transform || Object;
  const transformId = options.transformId || Object;

  if (transformStyles.indexOf(transformStyle) === -1) {
    transformStyles.push(transformStyle);
  }
  if (transformIds.indexOf(transformId) === -1) {
    transformIds.push(transformId);
  }

  const cacheKey = `${transformStyles.indexOf(
    transformStyle
  )}:${transformIds.indexOf(transformId)}`;
  let cache = caches[cacheKey];
  if (!cache) {
    cache = new WeakMap();
    caches[cacheKey] = cache;
  }
  let styles = cache.get(cssModule);
  if (styles) {
    return styles;
  }
  const list = cssModule._();
  styles = [];
  for (let i = 0, len = list.length; i < len; i += 1) {
    const item = list[i];
    const id = options.transformId(item[0], i);
    const css = item[1];
    const media = item[2];
    const sourceMap = item[3];
    const obj = { id, css, media, sourceMap };
    styles.push(options.transform ? options.transform(obj) : obj);
  }
  cache.set(cssModule, styles);
  return styles;
}
