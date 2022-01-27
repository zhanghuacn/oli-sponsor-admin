/// <reference types="react-scripts" />
declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

const CHARITY_PUBLIC_AWS_S3_ALBUM_BUCKET_NAME: string
const CHARITY_PUBLIC_AWS_S3_BUCKET_REGION: string
const CHARITY_PUBLIC_AWS_S3_IDENTITY_POOL_ID: string
const CHARITY_PUBLIC_AWS_S3_STATIC_DIR_NAME: string
const CHARITY_PUBLIC_AWS_S3_STATIC_HOST: string