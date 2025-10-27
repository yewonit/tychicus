// AWS SDK 최적화: 필요한 모듈만 import (95 MB → ~5 MB)
import S3 from 'aws-sdk/clients/s3';
import { CognitoIdentityCredentials } from 'aws-sdk';

export const AWSS3Ctrl = {
  data() {
    return {
      // AWS S3 버킷 정보
      albumBucketName: 'tychicus', // S3 버킷 이름
      bucketRegion: 'ap-northeast-2', // AWS 리전 (서울)
      IdentityPoolId: 'ap-northeast-2:bfd26cc6-669c-4afb-a4d3-580c5f35f776', // Cognito Identity Pool ID
      s3: null, // AWS S3 인스턴스를 저장할 변수
    };
  },
  created() {
    // 컴포넌트 생성 시 실행되는 훅 (현재 비어있음)
  },
  methods: {
    // AWS S3 인스턴스 설정
    /**
     * S3 인스턴스를 설정하고 Cognito Identity로 인증
     * @description Cognito Identity Pool을 사용하여 임시 AWS credentials 획득
     */
    async setS3() {
      // Cognito Identity Credentials 생성 (region 포함)
      const credentials = new CognitoIdentityCredentials(
        {
          IdentityPoolId: this.IdentityPoolId,
        },
        {
          region: this.bucketRegion,
        }
      );

      // Cognito credentials를 먼저 획득 (비동기)
      await credentials.getPromise();

      // S3 인스턴스 생성 (credentials와 region을 직접 전달)
      this.s3 = new S3({
        region: this.bucketRegion,
        credentials: credentials,
        apiVersion: '2006-03-01',
        params: { Bucket: this.albumBucketName },
      });
    },

    // S3 인스턴스 초기화
    async clearS3() {
      this.s3 = await null;
    },

    // S3에 파일 생성 (업로드)
    /**
     * S3에 파일을 업로드하는 함수
     * @param {string} fileName - S3에 저장될 파일 경로/이름
     * @param {File} fileObject - 업로드할 파일 객체
     * @returns {Promise<{fileName: string, filePath: string}|null>} 업로드 결과 또는 null
     */
    async s3CreateFile(fileName, fileObject) {
      let tempData = null;
      try {
        await this.setS3(); // S3 인스턴스 설정

        const result = await this.s3
          .upload({
            Key: fileName,
            Body: fileObject,
            ACL: 'public-read', // 파일을 공개적으로 읽을 수 있게 설정
          })
          .promise();

        tempData = {
          fileName: result.Key,
          filePath: result.Location,
        };
      } catch (error) {
        console.error('❌ S3 업로드 실패:', error);
        alert(
          '정보를 업로드하는데 실패하였습니다.(관리자 문의 : 010-3383-4177)'
        );
        // 에러 발생 시 null 반환
        tempData = null;
      } finally {
        await this.clearS3(); // S3 인스턴스 초기화
      }
      return tempData;
    },

    // S3 파일 목록 읽기
    async s3ReadFileList() {
      await this.setS3();
      let tempData = await null;
      await this.s3
        .listObjectsV2({
          Bucket: this.albumBucketName,
        })
        .promise()
        .then((data) => {
          tempData = data.Contents; // 파일 목록 저장
        })
        .catch(() => {});
      await this.clearS3();
      return tempData;
    },

    // S3에서 특정 파일 가져오기
    async s3GetFile(fileName) {
      let tempData = null;
      await this.setS3();
      await this.s3
        .getObject({
          Bucket: this.albumBucketName,
          Key: fileName,
        })
        .promise()
        .then((res) => {
          tempData = res.Body; // 파일 내용 저장
        })
        .catch(() => {});
      await this.clearS3();
      return tempData;
    },

    // S3 파일 업데이트 (기존 파일 덮어쓰기)
    async s3UpdateFile(userEmail, fileName, fileObject) {
      await this.setS3();
      let tempData = await null;
      await this.s3
        .upload({
          Key: userEmail + '_' + fileName, // 사용자 이메일을 파일명에 추가
          Body: fileObject,
          ACL: 'public-read',
        })
        .promise()
        .then((data) => {
          alert('업데이트 성공');
          tempData = data;
        })
        .catch(() => {});
      await this.clearS3();
      return tempData;
    },

    // S3 파일 삭제
    async s3DeleteFile(key) {
      await this.setS3();
      let tempData = await null;
      await this.s3
        .deleteObject({
          Bucket: this.albumBucketName,
          Key: key,
        })
        .promise()
        .then((data) => {
          tempData = data;
        })
        .catch(() => {});
      await this.clearS3();
      return tempData;
    },
  },
};
