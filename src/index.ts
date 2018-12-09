import S3 from "aws-sdk/clients/s3";
import * as nunjucks from "nunjucks";

const s3 = new S3();

/**
 * Options for configuring the S3 loader.
 */
interface Options {
  /**
   * The S3 bucket that contains the templates to load.
   */
  bucket: string;

  /**
   * A common prefix for all templates.
   *
   * If set, this string is prepended to the name of the template being loaded
   * to form the key of the file to download from S3.
   *
   * For instance, if you try to render `post.html`, and that template is stored
   * under the key `_templates/post.html`, then set `prefix` to `_templates/`.
   * The trailing slash is required.
   */
  prefix?: string;

  /**
   * A custom S3 client object to use.
   *
   * Only use if you need to pass custom options to the S3 constructor. If not
   * provided, the loader will use a shared `new S3()`.
   */
  client?: S3;
}

/**
 * A Nunjucks loader that asynchronously downloads templates from an S3 bucket.
 */
export default class S3Loader implements nunjucks.ILoader {
  opts: Options;
  async: boolean;

  constructor(opts: Options) {
    this.opts = opts;
    this.async = true;
  }

  get client(): S3 {
    return this.opts.client || s3;
  }

  getSource(name: string): nunjucks.LoaderSource;
  getSource(name: string, callback: (err?: any, result?: nunjucks.LoaderSource) => void): void;

  getSource(name: string, cb?: (err?: any, result?: nunjucks.LoaderSource) => void): void | nunjucks.LoaderSource {
    this.client.getObject({
      Bucket: this.opts.bucket,
      Key: this.templateKey(name)
    }, (err, result) => {
      if (cb) {
        if (err) {
          cb(err);
        } else if (!result.Body) {
          cb(new Error('no template body found in S3'));
        } else {
          const src = result.Body.toString();
          const res = {
            src,
            path: name,
            noCache: false
          }
          cb(null, res);
        }
      }
    });
  }

  private templateKey(name: string): string {
    const prefix = this.opts.prefix || '';
    return prefix + name;
  }
}
