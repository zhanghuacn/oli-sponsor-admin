import AWS from 'aws-sdk'
import { uuid } from '.'
import dayjs from 'dayjs'

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

  async upload(file: File): Promise<string> {
    if(!file) {
      throw new Error("Please choose a file to upload first.")
    }

    if(file.size / 1024 / 1024 / 10 >= 2) {
      throw new Error("The file size is too large and exceeds 2MB")
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