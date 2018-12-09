# nunjucks-s3-loader

A [`Loader`](https://mozilla.github.io/nunjucks/api.html#loader) for [nunjucks](https://mozilla.github.io/nunjucks/) that downloads templates from an S3 bucket.

This loader is intended for server-side rendering, where nunjucks can cache the compiled template.

**Note**: Using this loader requires you to use the asynchronous version of nunjucks's `render` method.

## Install

```
npm i nunjucks-s3-loader
```

## Example

```
import * as nunjucks from "nunjucks";
import S3Loader from "nunjucks-s3-loader";

const loader = new S3Loader({
  bucket: 'your-bucket-name', // Required
  prefix: '_templates/',      // Optional
});
const env = new nunjucks.Environment(loader);

env.render('post.html', { title: 'My Blog Post' }, (err, res) => {
  // ...
});
```

If you need to, you can pass in a custom S3 client:

```
const s3 = new S3({ ... });
const loader = new S3Loader({
  bucket: 'your-bucket-name',
  client: s3
});
```
