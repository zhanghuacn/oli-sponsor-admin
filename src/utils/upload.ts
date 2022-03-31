import AWS from 'aws-sdk'
import { uuid } from '.'
import dayjs from 'dayjs'

interface IAwsUploadOption {
  width?: number
  height?: number
}

class _AwsUploader {
  albumBucketName = CHARITY_PUBLIC_AWS_S3_ALBUM_BUCKET_NAME as string
  bucketRegion = CHARITY_PUBLIC_AWS_S3_BUCKET_REGION as string
  IdentityPoolId = CHARITY_PUBLIC_AWS_S3_IDENTITY_POOL_ID as string

  constructor() {
    this.onInit()
  }

  onInit() {
    AWS.config.update({
      region: this.bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.IdentityPoolId
      })
    });

    new AWS.S3({
      apiVersion: "2006-03-01",
      params: { Bucket: this.albumBucketName }
    });
  }

  async upload(file: File, opt?: IAwsUploadOption): Promise<string> {
    if(!file) {
      throw new Error("Please choose a file to upload first.")
    }

    if(file.size / 1024 / 1024 >= 2) {
      throw new Error("The file size is too large and exceeds 2MB")
    }

    // 当比例配置有值时
    if(opt?.width && opt?.height) {
      //读取图片数据
      await new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          if(e.target) {
            const data = e.target.result as any;
            // 加载图片获取图片真实宽度和高度
            const image = new Image();
            image.onload = function() {
              const width = image.width;
              const height = image.height;
              if(width / height === opt.width! / opt.height!) {
                resolve()
              } else {
                reject(new Error(`The width height ratio of the picture is not ${opt.width}x${opt.height}`))
              }
            }
            let bytes = new Uint8Array(data);
            let src = "";
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
              src += String.fromCharCode(bytes[i]);
            }
            image.src = "data:image/png;base64," + window.btoa(src);
          } else {
            resolve()
          }
        }
        reader.readAsArrayBuffer(file)
      })
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'))
    const filename = `${CHARITY_PUBLIC_AWS_S3_STATIC_DIR_NAME as string}/${dayjs().format('YYYYMMDD')}-${Date.now() + uuid(6, 10) + suffix}`
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: this.albumBucketName,
        Key: filename,
        Body: file
      }
    });
    await upload.promise()
    return `${CHARITY_PUBLIC_AWS_S3_STATIC_HOST}/${this.albumBucketName}/${filename}`
  }
}

export const AwsUploader = new _AwsUploader()