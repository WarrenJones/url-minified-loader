/**
 * Loader for image minfication combine with url-loader
 * Firstly it will minify the img and then filter with url-loader if:
 *
 * 1.img size after minified less or equal than limit size,transform and return base64 string
 * 2.img size after minified greater than limit size,return minified buffer
 */

const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");
const mime = require("mime");
const normalizeFallback = require("./utils/normalizeFallback");
const schema = require("./options.json");

function shouldTransform(limit, size) {
  if (typeof limit === "boolean") {
    return limit;
  }

  if (typeof limit === "string") {
    return size <= parseInt(limit, 10);
  }

  if (typeof limit === "number") {
    return size <= limit;
  }

  return true;
}

function loader(src) {
  // Loader Options
  const options = loaderUtils.getOptions(this) || {};
  // Normalize the fallback.
  const {
    loader: fallbackLoader,
    options: fallbackOptions
  } = normalizeFallback(options.fallback, options);
  // Require the fallback.
  const fallback = require(fallbackLoader);
  validateOptions(schema, options, {
    name: "URL Loader",
    baseDataPath: "options"
  });

  const callBack = this.async();
  require("imagemin")
    .buffer(src, { plugins: options.plugins || [] })
    .then(buffer => {
      // No limit or within the specified limit
      if (shouldTransform(options.limit, buffer.length)) {
        const file = this.resourcePath;
        // Get MIME type
        const mimetype = options.mimetype || mime.getType(file);

        if (typeof buffer === "string") {
          buffer = Buffer.from(buffer);
        }
        callBack(
          null,
          `module.exports = ${JSON.stringify(
            `data:${mimetype || ""};base64,${buffer.toString("base64")}`
          )}`
        );
      } else {
        // Call the fallback, passing a copy of the loader context. The copy has the query replaced. This way, the fallback
        // loader receives the query which was intended for it instead of the query which was intended for url-loader.
        const fallbackLoaderContext = Object.assign({}, this, {
          query: fallbackOptions
        });

        callBack(null, fallback.call(fallbackLoaderContext, buffer));
      }
    })
    .catch(err => {
      console.log("err", err);
      callBack(err);
    });
}
module.exports = loader;
module.exports.raw = true;
