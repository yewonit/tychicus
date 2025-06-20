import AWS from 'aws-sdk';

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
    async setS3() {
      // AWS 설정 업데이트
      await AWS.config.update({
        region: this.bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: this.IdentityPoolId,
        }),
      });
      // S3 인스턴스 생성
      this.s3 = await new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: this.albumBucketName },
      });
    },

    // S3 인스턴스 초기화
    async clearS3() {
      this.s3 = await null;
    },

    // S3에 파일 생성 (업로드)
    async s3CreateFile(fileName, fileObject, showLog) {
      if (showLog) {
        // 로그 출력 (디버깅용)
        console.log(`%c[ mixins: AWSS3Ctrl ] s3CreateFile`, `color: #008080;`);
        console.log(`%cfileName :`, `color: #008080;`, fileName);
        console.log(`%cfileObject :`, `color: #008080;`, fileObject);
      }
      let tempData = null;
      await this.setS3(); // S3 인스턴스 설정
      await this.s3
        .upload({
          Key: fileName,
          Body: fileObject,
          ACL: 'public-read', // 파일을 공개적으로 읽을 수 있게 설정
        })
        .promise()
        .then((res) => {
          if (showLog) {
            console.log(
              `%c[ ` + `%cread res` + `%c ] :`,
              `color: #008080;`,
              `color: #008080;`,
              `color: #008080;`,
              res
            );
          }
          tempData = {
            fileName: res.Key,
            filePath: res.Location,
          };
        })
        .catch((err) => {
          alert(
            '정보를 업로드하는데 실패하였습니다.(관리자 문의 : 010-3383-4177)'
          );
          console.log(err);
        });
      this.clearS3(); // S3 인스턴스 초기화
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
          console.log('리스트 가져오기 성공');
          console.log(data);
          tempData = data.Contents; // 파일 목록 저장
        })
        .catch((err) => {
          console.log('리스트 가져오기 실패');
          console.log(err);
        });
      await this.clearS3();
      return tempData;
    },

    // S3에서 특정 파일 가져오기
    async s3GetFile(fileName, logTogle) {
      if (logTogle) {
        console.log(`[ mixins: AWSS3Ctrl ] s3GetFile`);
        console.log(` fileName :`, fileName);
      }
      let tempData = null;
      await this.setS3();
      await this.s3
        .getObject({
          Bucket: this.albumBucketName,
          Key: fileName,
        })
        .promise()
        .then((res) => {
          console.log('파일 가져오기 성공');
          console.log(res);
          tempData = res.Body; // 파일 내용 저장
        })
        .catch((err) => {
          console.log('파일 가져오기 실패');
          console.log(err);
        });
      await this.clearS3();
      return tempData;
    },

    // S3 파일 업데이트 (기존 파일 덮어쓰기)
    async s3UpdateFile(userEmail, fileName, fileObject) {
      console.log(`[ mixins: AWSS3Ctrl ] s3UpdateFile`);
      console.log(` userEmail :`, userEmail);
      console.log(` fileName :`, fileName);
      console.log(` fileObject :`, fileObject);
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
          console.log('업데이트 성공');
          console.log(data);
          tempData = data;
        })
        .catch((err) => {
          console.log('업데이트 실패');
          console.log(err);
        });
      await this.clearS3();
      return tempData;
    },

    // S3 파일 삭제
    async s3DeleteFile(key, showLog) {
      if (showLog) {
        console.log(`%c[ mixins: AWSS3Ctrl ] s3DeleteFile`, `color: #008080;`);
        console.log(`%c key :`, `color: #008080;`, key);
      }

      await this.setS3();
      let tempData = await null;
      await this.s3
        .deleteObject({
          Bucket: this.albumBucketName,
          Key: key,
        })
        .promise()
        .then((data) => {
          if (showLog) {
            console.log(
              `%c[ ` + `%cdata` + `%c ] :`,
              `color: #008080;`,
              `color: #008080;`,
              `color: #008080;`,
              data
            );
          }
          tempData = data;
        })
        .catch((err) => {
          console.log('삭제 실패');
          console.log(err);
        });
      await this.clearS3();
      return tempData;
    },
  },
};
