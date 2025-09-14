import { AWSS3Ctrl } from "@/mixins/apis_v2/external/AWSS3Ctrl";
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { Utility } from "@/mixins/apis_v2/utility/Utility";
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
      // 1.1. (AWS-S3) 프로필 이미지를 생성한다
      let temps3CreateFile = await this.s3CreateFile(
        fileName,
        fileObject,
        showLog
      );

      // 1.2. (File) 파일정보를 생성한다
      let tempFileModel = {
        file_for: fileFor,
        file_name: temps3CreateFile.fileName,
        file_title: fileTitle,
        file_description: fileDescription,
        file_path: temps3CreateFile.filePath,
        file_size: fileObject.size,
        file_type: fileName.split(".").pop().toLowerCase(),
      };
      const newFile = await this.authCreateData(this.File, tempFileModel);
      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      let tempUHFileModel = {
        user_id: userId,
        file_id: newFile.id,
      };
      await this.authCreateData(this.UHFile, tempUHFileModel);

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
      // 1.1. (AWS-S3) 프로필 이미지를 생성한다
      let temps3CreateFile = await this.s3CreateFile(
        fileName,
        fileObject,
        showLog
      );

      // 1.2. (File) 파일정보를 생성한다
      let tempFileModel = {
        file_for: fileFor,
        file_name: temps3CreateFile.fileName,
        file_title: fileTitle,
        file_description: fileDescription,
        file_path: temps3CreateFile.filePath,
        file_size: fileObject.size,
        file_type: fileName.split(".").pop().toLowerCase(),
      };
      const newFile = await this.authCreateData(this.File, tempFileModel);
      // 1.3. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 생성한다
      let tempWHFileModel = {
        work_id: workId,
        file_id: newFile.id,
      };
      await this.authCreateData(this.WHFile, tempWHFileModel);
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
      // 1.1. (AWS-S3) 이미지를 생성한다
      let temps3CreateFile = await this.s3CreateFile(
        fileName,
        fileObject,
        showLog
      );
      // 1.2. (File) 파일정보를 생성한다
      let tempFileModel = {
        file_for: fileFor,
        file_name: temps3CreateFile.fileName,
        file_title: fileTitle,
        file_description: fileDescription,
        file_path: temps3CreateFile.filePath,
        file_size: fileObject.size,
        file_type: fileName.split(".").pop().toLowerCase(),
      };
      const newFile = await this.authCreateData(this.File, tempFileModel);
      // 1.3. (BNHFile) 비즈뉴스정보와 파일정보를 연결하는 데이터를 생성한다
      let tempBNHFileModel = {
        biz_news_id: biznewsId,
        file_id: newFile.id,
      };
      await this.authCreateData(this.BNHFile, tempBNHFileModel);
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
      // 1. (UHFile) 유저정보와 파일정보를 연결하는 데이터를 조회한다
      let tempUHFileList = await this.openReadUHFileListByUserId(
        userId,
        showLog
      );
      // 2. (File) 파일정보를 조회한다
      let tempFileList = [];
      for (let i = 0; i < tempUHFileList.length; i++) {
        const tempUHFile = tempUHFileList[i];
        const fileItem = await this.openReadDataItemById(
          this.File,
          tempUHFile.file_id
        );
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
      // 1. (WHFile) 유저정보와 파일정보를 연결하는 데이터를 조회한다
      let tempWHFileList = await this.openReadWHFileListByWorkId(
        workId,
        showLog
      );
      // 2. (File) 파일정보를 조회한다
      let tempFileList = [];
      for (let i = 0; i < tempWHFileList.length; i++) {
        const tempWHFile = tempWHFileList[i];
        const fileItem = await this.openReadDataItemById(
          this.File,
          tempWHFile.file_id
        );
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
      // 1. (BizNewsFile) 유저정보와 파일정보를 연결하는 데이터를 조회한다
      let tempBNHFileList = await this.openReadBNHFileListByBizNewsId(
        bizNewsId,
        showLog
      );
      // 2. (File) 파일정보를 조회한다
      let tempFileList = [];
      for (let i = 0; i < tempBNHFileList.length; i++) {
        const tempBNHFile = tempBNHFileList[i];
        const fileItem = await this.openReadDataItemById(
          this.File,
          tempBNHFile.file_id
        );
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
      // 1. (AWS-S3) 기존 이미지를 삭제한다
      // 1.1. (File) 파일정보를 불러온다.
      const tempFileItem = await this.authReadDataItemById(this.File, fileId);
      // 1.2. (AWS-S3) 파일이름을 활용해 S3 스토리지에서 파일을 삭제한다
      await this.s3DeleteFile(tempFileItem.file_name);
      // 2. (AWS-S3) 새로운 이미지를 생성한다
      let temps3CreateFile = await this.s3CreateFile(
        fileName,
        fileObject,
        showLog
      );
      // 3. (File) 파일정보를 업데이트한다
      let tempFileModel = {
        file_for: tempFileItem.file_for,
        file_name: temps3CreateFile.fileName,
        file_title: fileTitle,
        file_description: fileDescription,
        file_path: temps3CreateFile.filePath,
        file_size: fileObject.size,
        file_type: fileName.split(".").pop().toLowerCase(),
      };
      // UPDATE DATA
      const updatedFile = await this.authUpdateData(
        this.File,
        tempFileItem.id,
        tempFileModel
      );
      return updatedFile;
    },
    // DELETE FILE
    async deleteFile(fileId, showLog) {
      let totalResult = null;
      // 1. (File) 파일정보를 불러온다.
      const tempFileItem = await this.authReadDataItemById(this.File, fileId);
      // 2. (AWS-S3) 파일이름을 활용해 S3 스토리지에서 파일을 삭제한다
      await this.s3DeleteFile(tempFileItem.file_name);
      // 3. 연관된 파일 연결정보를 삭제한다

      // 3.1. (UHFile) 파일 연결정보를 DB에서 삭제한다
      // 3.1.1. (UHFile) fileId를 통해 연결정보를 DB에서 가져온다
      const UHFileListByFileId = await this.authReadUHFileListByFileId(fileId);
      // 3.1.2. (UHFile) Id를 통해 연결정보를 DB에서 삭제한다

      if (UHFileListByFileId.length > 0) {
        for (let i = 0; i < UHFileListByFileId.length; i++) {
          await this.authDeleteData(this.UHFile, UHFileListByFileId[i].id);
          totalResult = 1;
        }
      }

      // 3.2. (WHFile) 파일 연결정보를 DB에서 삭제한다
      // 3.2.1. (WHFile) fileId를 통해 연결정보를 DB에서 가져온다
      const WHFileListByFileId = await this.authReadWHFileListByFileId(fileId);
      // 3.2.2. (WHFile) Id를 통해 연결정보를 DB에서 삭제한다
      if (WHFileListByFileId.length > 0) {
        for (let i = 0; i < WHFileListByFileId.length; i++) {
          await this.authDeleteData(this.WHFile, WHFileListByFileId[i].id);
          totalResult = 1;
        }
      }

      // 3.3. (BNHFile) 파일 연결정보를 DB에서 삭제한다
      // 3.3.1. (BNHFile) fileId를 통해 연결정보를 DB에서 가져온다
      const BNHFileListByFileId = await this.authReadBNHFileListByFileId(
        fileId
      );
      // 3.3.2. (BNHFile) Id를 통해 연결정보를 DB에서 삭제한다
      if (BNHFileListByFileId.length > 0) {
        for (let i = 0; i < BNHFileListByFileId.length; i++) {
          await this.authDeleteData(this.BNHFile, BNHFileListByFileId[i].id);
          totalResult = 1;
        }
      }

      // 4. (File) 파일정보를 DB에서 삭제한다
      await this.authDeleteData(this.File, tempFileItem.id);
      return totalResult;
    },
  },
};
