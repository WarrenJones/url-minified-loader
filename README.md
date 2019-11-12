# img-loader

Image minimizing before transform to base64.

1.img size after minified less or equal than limit size,transform and return base64 string
2.img size after minified greater than limit size,return minified buffer

url-minified-loader has a peer dependency on `imagemin`, so you will need to make sure to include that, along with any imagemin plugins you will use.


## Install

```sh
$ npm install url-minified-loader --save-dev
```


## Usage

[Documentation: Using loaders](https://webpack.js.org/concepts/loaders/)

```javascript
oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            use: [
              {
                // loader: "url-loader",
                "url-minified-loader",
                options: {
                  limit: 5 * 1024,
                  //https://github.com/imagemin/imagemin
                  plugins: [
                    //https://github.com/imagemin/imagemin-pngquant/blob/master/index.js
                    require("imagemin-pngquant")({ quality: [0.01,0.01] })
                  ],
                  name: "[name].[hash:8].[ext]"
                }
              }
            ]
          }
]
```

By default the loader simply passes along the image unmodified.



### Options

### `fallback`

Type: `String`
Default: `'file-loader'`

Specifies an alternative loader to use when a target file's size exceeds the
limit set in the `limit` option.


### `plugins`

Type: `Array`
Default: `[]`
Options are forwarded to `imagemin.buffer(image, options)`, so any plugins you would like to use for optimizing the images are passed as the `plugins` property.

For more details on each plugin's options, see their documentation on [Github](https://github.com/imagemin).

```javascript
oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            use: [
              {
                // loader: "url-loader",
                "url-minified-loader",
                options: {
                  limit: 5 * 1024,
                  //https://github.com/imagemin/imagemin
                  plugins: [
                    //https://github.com/imagemin/imagemin-pngquant/blob/master/index.js
                    require("imagemin-pngquant")({ quality: [0.01,0.01] })
                  ],
                  name: "[name].[hash:8].[ext]"
                }
              }
            ]
          }
]
```


If you only want to run imagemin in production builds, you can omit the `url-minfied-loader` or leave plugins empty in your production configuration file. If you don't keep a separate configuration for prod builds, something like the following also works:

```js
{
  loader: 'url-minfied-loader',
  options: {
    plugins: process.env.NODE_ENV === 'production' && [
      require('imagemin-svgo')({})
      // etc.
    ]
  }
}
```



 you'll need to install these imagemin plugins:

* [imagemin-gifsicle](https://github.com/imagemin/imagemin-gifsicle)
* [imagemin-mozjpeg](https://github.com/imagemin/imagemin-mozjpeg)
* [imagemin-optipng](https://github.com/imagemin/imagemin-optipng)
* [imagemin-svgo](https://github.com/imagemin/imagemin-svgo)

Then use this loader setup in your webpack configuration file:

```js
{
  loader: 'url-minified-loader',
  options: {
    plugins: [
      require('imagemin-gifsicle')({}),
      require('imagemin-mozjpeg')({}),
      require('imagemin-optipng')({}),
      require('imagemin-svgo')({})
    ]
  }
}
```

The options object you had under a plugin's name property, should instead be passed directly to the plugin after you require it.

If you used the optional `pngquant` settings, then you will additionally need to install [imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant), and add it to your plugins array as any other imagemin plugin.


## License

This software is free to use under the MIT license. See the [LICENSE-MIT file][LICENSE] for license text and copyright information.

