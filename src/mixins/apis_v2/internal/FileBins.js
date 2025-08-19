import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
import { AWSS3Ctrl } from '@/mixins/apis_v2/external/AWSS3Ctrl';
import { Utility } from '@/mixins/apis_v2/utility/Utility';
export const FileBins = {
  data() {
    return {};
  },
  created() {
    // ToDo
    // [ ] Create 실패할 경우 처리정책 수립
  },
  mixins: [MasterCtrl, AWSS3Ctrl, Utility],
  methods: {
    // CREATE FIEL
    // USER
    /**
     * @description 유저 파일을 생성한다.
     * @param {Number} userId 유저 아이디
     * @param {String} fileFor 파일의 목적
     * @param {Object} fileObject 실재 파일 객체
     * @param {String} fileName 자동 생성된 파일 이름
     * @param {String} fileTitle 파일의 제목
     * @param {String} fileDescription 파일의 설명
     * @param {boolean} showLog 로그 출력 여부 표시할지 여부 (기본값: false)
     * @returns {Object} 생성된 파일 객체
     */
    async createUserFile(
      userId,
      fileFor,
      fileObject,
      fileName,
      fileTitle,
      fileDescription,
      showLog
    ) {
      if (showLog) {
        console.log(`%c[ mixins: FileBins ] createUserFile`, `color:#6495ED;`);
        console.log(`%cfileName :`, `color:#6495ED;`, fileName);
        console.log(`%cfileObject :`, `color:#6495ED;`, fileObject);
      }
      // 1.1. (AWS-S3) 프로필 이미지를 생성한다
      let temps3CreateFile = await this.s3CreateFile(
        fileName,
        fileObject,
        showLog
      );
      if (showLog) {
        console.log(
          `%c[ Data ] temps3CreateFile`,
          `color:#6495ED;`,
          temps3CreateFile
        );
      }

      // 1.2. (File) 파일정보를 생성한다
      let tempFileModel = {
        file_for: fileFor,
        file_name: temps3CreateFile.fileName,
        file_title: fileTitle,
        file_description: fileDescription,
        file_path: temps3CreateFile.filePath,
        file_size: fileObject.size,
        file_type: fileName.split('.').pop().toLowerCase(),
      };
      const newFile = await this.authCreateData(this.File, tempFileModel);
      if (showLog) {
        console.log(`%c[ Data ] newFile`, 'color: #6495ED;', newFile);
      }
      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      let tempUHFileModel = {
        user_id: userId,
        file_id: newFile.id,
      };
      const newUHFile = await this.authCreateData(this.UHFile, tempUHFileModel);
      if (showLog) {
        console.log(`%c[ Data ] newUHFile`, 'color: #6495ED;', newUHFile);
      }
      return newFile;
    },
    // WORK
    /**
     * @description 산업 파일을 생성한다.
     * @param {Number} workId 산업에 대한 아이디
     * @param {String} fileFor 파일의 목적
     * @param {Object} fileObject 실재 파일 객체
     * @param {String} fileName 자동 생성된 파일 이름
     * @param {String} fileTitle 파일의 제목
     * @param {String} fileDescription 파일의 설명
     * @param {boolean} showLog 로그 출력 여부 표시할지 여부 (기본값: false)
     * @returns {Object} 생성된 파일 객체
     */
    async createWorkFile(
      workId,
      fileFor,
      fileObject,
      fileName,
      fileTitle,
      fileDescription,
      showLog
    ) {
      if (showLog) {
        console.log(`%c[ mixins: FileBins ] createWorkFile`, `color:#6495ED;`);
        console.log(`%cfileName :`, `color:#6495ED;`, fileName);
        console.log(`%cfileObject :`, `color:#6495ED;`, fileObject);
      }
      // 1.1. (AWS-S3) 프로필 이미지를 생성한다
      let temps3CreateFile = await this.s3CreateFile(
        fileName,
        fileObject,
        showLog
      );
      if (showLog) {
        console.log(
          `%c[ Data ] temps3CreateFile`,
          `color:#6495ED;`,
          temps3CreateFile
        );
      }

      // 1.2. (File) 파일정보를 생성한다
      let tempFileModel = {
        file_for: fileFor,
        file_name: temps3CreateFile.fileName,
        file_title: fileTitle,
        file_description: fileDescription,
        file_path: temps3CreateFile.filePath,
        file_size: fileObject.size,
        file_type: fileName.split('.').pop().toLowerCase(),
      };
      const newFile = await this.authCreateData(this.File, tempFileModel);
      if (showLog) {
        console.log(`%c[ Data ] newFile`, 'color: #6495ED;', newFile);
      }
      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      let tempWHFileModel = {
        work_id: workId,
        file_id: newFile.id,
      };
      const newWHFile = await this.authCreateData(this.WHFile, tempWHFileModel);
      if (showLog) {
        console.log(`%c[ Data ] newWHFile`, 'color: #6495ED;', newWHFile);
      }
      return newFile;
    },
    // BIZNEWS
    /**
     * @description 비즈니스뉴스 파일을 생성한다.
     * @param {Number} biznewsId 비즈니스뉴스에 대한 아이디
     * @param {String} fileFor 파일의 목적
     * @param {Object} fileObject 실재 파일 객체
     * @param {String} fileName 자동 생성된 파일 이름
     * @param {String} fileTitle 파일의 제목
     * @param {String} fileDescription 파일의 설명
     * @param {boolean} showLog 로그 출력 여부 표시할지 여부 (기본값: false)
     * @returns {Object} 생성된 파일 객체
     */
    async createBizNewsFile(
      biznewsId,
      fileFor,
      fileObject,
      fileName,
      fileTitle,
      fileDescription,
      showLog
    ) {
      if (showLog) {
        console.log(
          `%c[ mixins: FileBins ] createBizNewsFile`,
          `color:#6495ED;`
        );
        console.log(`%cfileName :`, `color:#6495ED;`, fileName);
        console.log(`%cfileObject :`, `color:#6495ED;`, fileObject);
      }
      // 1.1. (AWS-S3) 이미지를 생성한다
      let temps3CreateFile = await this.s3CreateFile(
        fileName,
        fileObject,
        showLog
      );
      if (showLog) {
        console.log(
          `%c[ Data ] temps3CreateFile`,
          `color:#6495ED;`,
          temps3CreateFile
        );
      }
      // 1.2. (File) 파일정보를 생성한다
      let tempFileModel = {
        file_for: fileFor,
        file_name: temps3CreateFile.fileName,
        file_title: fileTitle,
        file_description: fileDescription,
        file_path: temps3CreateFile.filePath,
        file_size: fileObject.size,
        file_type: fileName.split('.').pop().toLowerCase(),
      };
      const newFile = await this.authCreateData(this.File, tempFileModel);
      if (showLog) {
        console.log(`%c[ Data ] newFile`, 'color: #6495ED;', newFile);
      }
      // 1.3. (BNHFile) 비즈뉴스정보와 파일정보를 연결하는 데이터를 생성한다
      let tempBNHFileModel = {
        biz_news_id: biznewsId,
        file_id: newFile.id,
      };
      const newBNHFile = await this.authCreateData(
        this.BNHFile,
        tempBNHFileModel
      );
      if (showLog) {
        console.log(`%c[ Data ] newBNHFile`, 'color: #6495ED;', newBNHFile);
      }
      return newFile;
    },
    // READ FILE
    /**
     * @description userId와 fileFor를 통해 파일리스트를 읽어온다
     * @param {Number} userId 유저 아이디
     * @param {String} fileFor 파일의 목적
     * @param {boolean} showLog 로그 출력 여부 표시할지 여부 (기본값은 false)
     * @returns {Array} 파일 리스트
     */
    async readUserFileList(userId, fileFor, showLog) {
      if (showLog) {
        console.log(`%c[ mixins: FileBins ] readUserFiles`, `color:#6495ED;`);
        console.log(`%cuserId :`, `color:#6495ED;`, userId);
        console.log(`%cfileFor :`, `color:#6495ED;`, fileFor);
      }
      // 1. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 조회한다
      let tempUHFileList = await this.openReadUHFileListByUserId(
        userId,
        showLog
      );
      if (showLog) {
        console.log(
          `%c[ Data ] tempUHFileList`,
          'color: #6495ED;',
          tempUHFileList
        );
      }
      // 2. (File) 파일정보를 조회한다
      let tempFileList = [];
      for (let i = 0; i < tempUHFileList.length; i++) {
        const tempUHFile = tempUHFileList[i];
        const fileItem = await this.openReadDataItemById(
          this.File,
          tempUHFile.file_id
        );
        console.log(`%c[ Data ] fileItem`, 'color: #E3DAC9;', fileItem);
        tempFileList.push(fileItem);
      }

      if (tempFileList.length == 0) {
        return [];
      }

      // 3. (File) tempFileList배열을 fileFor에 해당하는 요소들로 필터링한다
      let tempFileListByFileFor = [];
      for (let i = 0; i < tempFileList.length; i++) {
        const tempFile = tempFileList[i];
        if (tempFile.file_for === fileFor) {
          tempFileListByFileFor.push(tempFile);
        }
      }

      if (tempFileListByFileFor.length == 0) {
        return [];
      }
      // 4. (File) 필터링된 조회결과를 반환한다
      return tempFileListByFileFor;
    },
    /**
     * @description workId와 file_for를 활용해 파일리스트를 읽어온다
     * @param {Number} workId 산업 아이디
     * @param {String} fileFor 파일의 목적
     * @param {boolean} showLog 로그 출력 여부 표시할지 여부 (기본값은 false)
     * @returns {Array} 파일 리스트
     */
    async readWorkFileList(workId, fileFor, showLog) {
      if (showLog) {
        console.log(`%c[ mixins: FileBins ] readWorkFiles`, `color:#6495ED;`);
        console.log(`%cworkId :`, `color:#6495ED;`, workId);
        console.log(`%cfileFor :`, `color:#6495ED;`, fileFor);
      }
      // 1. (WHFile) 유저정보와 파일정보를 연결하는 데이터를 조회한다
      let tempWHFileList = await this.openReadWHFileListByWorkId(
        workId,
        showLog
      );
      if (showLog) {
        console.log(
          `%c[ Data ] tempWHFileList`,
          'color: #6495ED;',
          tempWHFileList
        );
      }
      // 2. (File) 파일정보를 조회한다
      let tempFileList = [];
      for (let i = 0; i < tempWHFileList.length; i++) {
        const tempWHFile = tempWHFileList[i];
        const fileItem = await this.openReadDataItemById(
          this.File,
          tempWHFile.file_id
        );
        if (showLog) {
          console.log(`%c[ Data ] fileItem`, 'color: #E3DAC9;', fileItem);
        }
        tempFileList.push(fileItem);
      }

      if (tempFileList.length == 0) {
        return [];
      }

      // 3. (File) tempFileList배열을 fileFor에 해당하는 요소들로 필터링한다
      let tempFileListByFileFor = [];
      for (let i = 0; i < tempFileList.length; i++) {
        const tempFile = tempFileList[i];
        if (tempFile.file_for === fileFor) {
          tempFileListByFileFor.push(tempFile);
        }
      }

      if (tempFileListByFileFor.length == 0) {
        return [];
      }

      // 4. (File) 필터링된 조회결과를 반환한다
      return tempFileListByFileFor;
    },
    /**
     * @description bizNewsId와 file_for를 활용해 파일리스트를 읽어온다
     * @param {Number} bizNewsId 산업 아이디
     * @param {String} fileFor 파일의 목적
     * @param {boolean} showLog 로그 출력 여부 표시할지 여부 (기본값은 false)
     * @returns {Array} 파일 리스트
     */
    async readBizNewsFileList(bizNewsId, fileFor, showLog) {
      if (showLog) {
        console.log(
          `%c[ mixins: FileBins ] readBizNewsFiles`,
          `color:#6495ED;`
        );
        console.log(`%cbizNewsId :`, `color:#6495ED;`, bizNewsId);
        console.log(`%cfileFor :`, `color:#6495ED;`, fileFor);
      }
      // 1. (BizNewsFile) 유저정보와 파일정보를 연결하는 데이터를 조회한다
      let tempBNHFileList = await this.openReadBNHFileListByBizNewsId(
        bizNewsId,
        showLog
      );
      if (showLog) {
        console.log(
          `%c[ Data ] tempBNHFileList`,
          'color: #6495ED;',
          tempBNHFileList
        );
      }
      // 2. (File) 파일정보를 조회한다
      let tempFileList = [];
      for (let i = 0; i < tempBNHFileList.length; i++) {
        const tempBNHFile = tempBNHFileList[i];
        const fileItem = await this.openReadDataItemById(
          this.File,
          tempBNHFile.file_id
        );
        console.log(`%c[ Data ] fileItem`, 'color: #E3DAC9;', fileItem);
        tempFileList.push(fileItem);
      }

      if (tempFileList.length == 0) {
        return [];
      }

      // 3. (File) tempFileList배열을 fileFor에 해당하는 요소들로 필터링한다
      let tempFileListByFileFor = [];
      for (let i = 0; i < tempFileList.length; i++) {
        const tempFile = tempFileList[i];
        if (tempFile.file_for === fileFor) {
          tempFileListByFileFor.push(tempFile);
        }
      }

      if (tempFileListByFileFor.length == 0) {
        return [];
      }

      // 4. (File) 필터링된 조회결과를 반환한다
      return tempFileListByFileFor;
    },

    // UPDATE FIEL
    /**
     * @description 파일 S3에 파일을 교체하고, File정보를 업데이트한다
     * @param {Number} fileId 수정할 파일의 아이디
     * @param {Object} fileObject 새로운 파일 객체
     * @param {String} fileName 수정할 파일 이름
     * @param {String} fileTitle 수정할 파일 제목
     * @param {String} fileDescription 수정할 파일 설명
     * @param {Boolean} showLog 로그 출력 여부 표시할지 여부 (기본값은 false)
     * @returns {Object} 업데이트된 파일 정보
     */
    async updateFile(
      fileId,
      fileObject,
      fileName,
      fileTitle,
      fileDescription,
      showLog
    ) {
      if (showLog) {
        console.log(`%c[ mixins: FileBins ] updateUserFile`, `color:#6495ED;`);
        console.log(`%cfileId :`, `color:#6495ED;`, fileId);
        console.log(`%cfileObject :`, `color:#6495ED;`, fileObject);
        console.log(`%cfileName :`, `color:#6495ED;`, fileName);
        console.log(`%cfileTitle :`, `color:#6495ED;`, fileTitle);
        console.log(`%cfileDescription :`, `color:#6495ED;`, fileDescription);
      }
      // 1. (AWS-S3) 기존 이미지를 삭제한다
      // 1.1. (File) 파일정보를 불러온다.
      const tempFileItem = await this.authReadDataItemById(this.File, fileId);
      if (showLog) {
        console.log(`%c[ Data ] tempFileItem`, 'color: #6495ED;', tempFileItem);
      }
      // 1.2. (AWS-S3) 파일이름을 활용해 S3 스토리지에서 파일을 삭제한다
      const s3DeleteFileResult = await this.s3DeleteFile(
        tempFileItem.file_name
      );
      if (showLog) {
        console.log(
          `%c[ Data ] s3DeleteFileResult`,
          'color: #6495ED;',
          s3DeleteFileResult
        );
      }
      // 2. (AWS-S3) 새로운 이미지를 생성한다
      let temps3CreateFile = await this.s3CreateFile(
        fileName,
        fileObject,
        showLog
      );
      if (showLog) {
        console.log(
          `%c[ Data ] temps3CreateFile`,
          `color:#6495ED;`,
          temps3CreateFile
        );
      }
      // 3. (File) 파일정보를 업데이트한다
      let tempFileModel = {
        file_for: tempFileItem.file_for,
        file_name: temps3CreateFile.fileName,
        file_title: fileTitle,
        file_description: fileDescription,
        file_path: temps3CreateFile.filePath,
        file_size: fileObject.size,
        file_type: fileName.split('.').pop().toLowerCase(),
      };
      // UPDATE DATA
      const updatedFile = await this.authUpdateData(
        this.File,
        tempFileItem.id,
        tempFileModel
      );
      console.log(`%c[ Data ] updatedFile`, 'color: #6495ED;', updatedFile);
      return updatedFile;
    },
    // DELETE FILE
    async deleteFile(fileId, showLog) {
      let totalResult = null;
      if (showLog) {
        console.log(`%c[ mixins: FileBins ] deleteFile`, `color:#6495ED;`);
        console.log(`%cfileId :`, `color:#6495ED;`, fileId);
      }
      // 1. (File) 파일정보를 불러온다.
      const tempFileItem = await this.authReadDataItemById(this.File, fileId);
      if (showLog) {
        console.log(`%c[ Data ] tempFileItem`, 'color: #6495ED;', tempFileItem);
      }
      // 2. (AWS-S3) 파일이름을 활용해 S3 스토리지에서 파일을 삭제한다
      const s3DeleteFileResult = await this.s3DeleteFile(
        tempFileItem.file_name
      );
      if (showLog) {
        console.log(
          `%c[ Data ] s3DeleteFileResult`,
          'color: #6495ED;',
          s3DeleteFileResult
        );
      }
      // 3. 연관된 파일 연결정보를 삭제한다

      // 3.1. (UHFile) 파일 연결정보를 DB에서 삭제한다
      // 3.1.1. (UHFile) fileId를 통해 연결정보를 DB에서 가져온다
      const UHFileListByFileId = await this.authReadUHFileListByFileId(fileId);
      if (showLog) {
        console.log(
          `%c[ Data ] UHFileListByFileId`,
          'color: #6495ED;',
          UHFileListByFileId
        );
      }
      // 3.1.2. (UHFile) Id를 통해 연결정보를 DB에서 삭제한다

      if (UHFileListByFileId.length > 0) {
        for (let i = 0; i < UHFileListByFileId.length; i++) {
          const deleteUHFileResult = await this.authDeleteData(
            this.UHFile,
            UHFileListByFileId[i].id
          );

          if (showLog) {
            console.log(
              `%c[ Data ] deleteUHFileResult`,
              'color: #6495ED;',
              deleteUHFileResult
            );
          }
          totalResult = 1;
        }
      }

      // 3.2. (WHFile) 파일 연결정보를 DB에서 삭제한다
      // 3.2.1. (WHFile) fileId를 통해 연결정보를 DB에서 가져온다
      const WHFileListByFileId = await this.authReadWHFileListByFileId(fileId);
      if (showLog) {
        console.log(
          `%c[ Data ] WHFileListByFileId`,
          'color: #6495ED;',
          WHFileListByFileId
        );
      }
      // 3.2.2. (WHFile) Id를 통해 연결정보를 DB에서 삭제한다
      if (WHFileListByFileId.length > 0) {
        for (let i = 0; i < WHFileListByFileId.length; i++) {
          const deleteWHFileResult = await this.authDeleteData(
            this.WHFile,
            WHFileListByFileId[i].id
          );
          if (showLog) {
            console.log(
              `%c[ Data ] deleteWHFileResult`,
              'color: #6495ED;',
              deleteWHFileResult
            );
          }
          totalResult = 1;
        }
      }

      // 3.3. (BNHFile) 파일 연결정보를 DB에서 삭제한다
      // 3.3.1. (BNHFile) fileId를 통해 연결정보를 DB에서 가져온다
      const BNHFileListByFileId = await this.authReadBNHFileListByFileId(
        fileId
      );
      if (showLog) {
        console.log(
          `%c[ Data ] BNHFileListByFileId`,
          'color: #6495ED;',
          BNHFileListByFileId
        );
      }
      // 3.3.2. (BNHFile) Id를 통해 연결정보를 DB에서 삭제한다
      if (BNHFileListByFileId.length > 0) {
        for (let i = 0; i < BNHFileListByFileId.length; i++) {
          const deleteBNHFileResult = await this.authDeleteData(
            this.BNHFile,
            BNHFileListByFileId[i].id
          );
          if (showLog) {
            console.log(
              `%c[ Data ] deleteBNHFileResult`,
              'color: #6495ED;',
              deleteBNHFileResult
            );
          }
          totalResult = 1;
        }
      }

      // 4. (File) 파일정보를 DB에서 삭제한다
      const authDeletedFileResult = await this.authDeleteData(
        this.File,
        tempFileItem.id
      );
      if (showLog) {
        console.log(
          `%c[ Data ] authDeletedFileResult`,
          'color: #6495ED;',
          authDeletedFileResult
        );
      }
      return totalResult;
    },
  },
};
