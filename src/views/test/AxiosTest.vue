<template>
  <v-container class="pt-16">
    <v-row>
      <!-- [ FILE CRUD ] USER PROFILE -->
      <v-col cols="4">
        <v-card class="pa-5">
          <v-card-title class=""> [ FILE CRUD ] USER PROFILE </v-card-title>
          <v-card-subtitle class=""> v-card </v-card-subtitle>
          <!-- 이미지파일 업로드 -->
          <v-file-input
            class="pa-5"
            id="file"
            label="File"
            prepend-icon="mdi-camera"
            v-model="userProfile.fileObject"
            @change="testFileCRUD_userProfile"
          ></v-file-input>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
      <!-- [ FILE CRUD ] WORK REPRESENTATIVE IMAGE -->
      <v-col cols="4">
        <v-card class="pa-5">
          <v-card-title class="">
            [ FILE CRUD ] WORK REPRESENTATIVE IMAGE
          </v-card-title>
          <v-card-subtitle class=""> v-card </v-card-subtitle>
          <!-- 이미지파일 업로드 -->
          <v-file-input
            class="pa-5"
            id="file"
            label="File"
            prepend-icon="mdi-camera"
            v-model="workRefImg.fileObject"
            @change="testFileCRUD_workRefImg"
          ></v-file-input>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
      <!-- [ FILE CRUD ] WORK PORTFOLIO -->
      <v-col cols="4">
        <v-card class="pa-5">
          <v-card-title class=""> [ FILE CRUD ] WORK PORTFOLIO </v-card-title>
          <v-card-subtitle class=""> v-card </v-card-subtitle>
          <!-- 이미지파일 업로드 -->
          <v-file-input
            class="pa-5"
            id="file"
            label="File"
            prepend-icon="mdi-camera"
            v-model="workPortfolio.fileObject"
            @change="testFileCRUD_workPortfolio"
          ></v-file-input>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
      <!-- [ FILE CRUD ] BIZNEWS REPRESENTATIVE -->
      <v-col cols="4">
        <v-card class="pa-5">
          <v-card-title class="">
            [ FILE CRUD ] BIZNEWS REPRESENTATIVE
          </v-card-title>
          <v-card-subtitle class=""> v-card </v-card-subtitle>
          <!-- 이미지파일 업로드 -->
          <v-file-input
            class="pa-5"
            id="file"
            label="File"
            prepend-icon="mdi-camera"
            v-model="biznewsRef.fileObject"
            @change="testFileCRUD_biznewsRef"
          ></v-file-input>
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { MasterCtrl } from "@/mixins/apis_v2/internal/MasterCtrl";
import { FileBins } from "@/mixins/apis_v2/internal/FileBins";
import { Utility } from "@/mixins/apis_v2/utility/Utility";
export default {
  name: "TTD",
  data() {
    return {
      userProfile: {
        file_id: 0,
        file_for: "",
        file_name: "",
        file_title: "fileTitle",
        file_description: "fileDescription",
        file_path: "",
        file_size: "",
        file_type: "",
        fileName: "",
        fileObject: null,
        tempUrl: "",
      },
      workRefImg: {
        file_id: 0,
        file_for: "",
        file_name: "",
        file_title: "fileTitle",
        file_description: "fileDescription",
        file_path: "",
        file_size: "",
        file_type: "",
        fileName: "",
        fileObject: null,
        tempUrl: "",
      },
      workPortfolio: {
        file_id: 0,
        file_for: "",
        file_name: "",
        file_title: "fileTitle",
        file_description: "fileDescription",
        file_path: "",
        file_size: "",
        file_type: "",
        fileName: "",
        fileObject: null,
        tempUrl: "",
      },
      biznewsRef: {
        file_id: 0,
        file_for: "",
        file_name: "",
        file_title: "fileTitle",
        file_description: "fileDescription",
        file_path: "",
        file_size: "",
        file_type: "",
        fileName: "",
        fileObject: null,
        tempUrl: "",
      },
    };
  },
  created() {
    console.log("let test!");
    this.test();
  },
  mixins: [MasterCtrl, FileBins, Utility],
  methods: {
    async test() {
      // await this.testFile();
      // await this.testUser();
      // await this.testUHFile();
      // await this.testWork();
      // await this.testWHFile();
      // await this.testBizNews();
      // await this.testBNHFile();
    },

    async testFile() {
      console.log(`%c[ View: AxiosTest ] testFile()`, `color:#BFFF00;`);
      // CREAT DATA
      const authNewFile = await this.authCreateData(this.File, this.modelFile);
      console.log(`%c[ Data ] authNewFile`, "color: #E3DAC9;", authNewFile);

      const openNewFile = await this.openCreateData(this.File, this.modelFile);
      console.log(`%c[ Data ] openNewFile`, "color: #E3DAC9;", openNewFile);
      // READ DATA
      const authFileList = await this.authReadDataList(this.File);
      console.log(`%c[ Data ] authFileList`, "color: #E3DAC9;", authFileList);
      const openFileList = await this.openReadDataList(this.File);
      console.log(`%c[ Data ] openFileList`, "color: #E3DAC9;", openFileList);
      const authFileItem = await this.authReadDataItemById(
        this.File,
        authNewFile.id
      );
      console.log(`%c[ Data ] authFileItem`, "color: #E3DAC9;", authFileItem);
      const openFileItem = await this.openReadDataItemById(
        this.File,
        openNewFile.id
      );
      console.log(`%c[ Data ] openFileItem`, "color: #E3DAC9;", openFileItem);
      // UPDATE DATA
      const authUpdatedFile = await this.authUpdateData(
        this.File,
        authNewFile.id,
        this.modelFile
      );
      console.log(
        `%c[ Data ] authUpdatedFile`,
        "color: #E3DAC9;",
        authUpdatedFile
      );
      const openUpdatedFile = await this.openUpdateData(
        this.File,
        openNewFile.id,
        this.modelFile
      );
      console.log(
        `%c[ Data ] openUpdatedFile
      `,
        "color: #E3DAC9;",
        openUpdatedFile
      );
      // DELETE DATA
      const authDeletedFile = await this.authDeleteData(
        this.File,
        authNewFile.id
      );
      console.log(
        `%c[ Data ] authDeletedFile`,
        "color: #E3DAC9;",
        authDeletedFile
      );
      const openDeletedFile = await this.openDeleteData(
        this.File,
        openNewFile.id
      );
      console.log(
        `%c[ Data ] openDeletedFile`,
        "color: #E3DAC9;",
        openDeletedFile
      );
    },
    async testUser() {
      console.log(`%c[ View: AxiosTest ] testUser()`, `color:#BFFF00;`);
      // CREAT DATA
      const authNewUser = await this.authCreateData(this.User, this.modelUser);
      console.log(`%c[ Data ] authNewUser`, "color: #E3DAC9;", authNewUser);

      const openNewUser = await this.openCreateData(this.User, this.modelUser);
      console.log(`%c[ Data ] openNewUser`, "color: #E3DAC9;", openNewUser);
      // READ DATA
      const authUserList = await this.authReadDataList(this.User);
      console.log(`%c[ Data ] authUserList`, "color: #E3DAC9;", authUserList);
      const openUserList = await this.openReadDataList(this.User);
      console.log(`%c[ Data ] openUserList`, "color: #E3DAC9;", openUserList);
      const authUserItem = await this.authReadDataItemById(
        this.User,
        authNewUser.id
      );
      console.log(`%c[ Data ] authUserItem`, "color: #E3DAC9;", authUserItem);
      const openUserItem = await this.openReadDataItemById(
        this.User,
        openNewUser.id
      );
      console.log(`%c[ Data ] openUserItem`, "color: #E3DAC9;", openUserItem);
      // UPDATE DATA
      const authUpdatedUser = await this.authUpdateData(
        this.User,
        authNewUser.id,
        this.modelUser
      );
      console.log(
        `%c[ Data ] authUpdatedUser`,
        "color: #E3DAC9;",
        authUpdatedUser
      );
      const openUpdatedUser = await this.openUpdateData(
        this.User,
        openNewUser.id,
        this.modelUser
      );
      console.log(
        `%c[ Data ] openUpdatedUser`,
        "color: #E3DAC9;",
        openUpdatedUser
      );
      // DELETE DATA
      const authDeletedUser = await this.authDeleteData(
        this.User,
        authNewUser.id
      );
      console.log(
        `%c[ Data ] authDeletedUser`,
        "color: #E3DAC9;",
        authDeletedUser
      );
      const openDeletedUser = await this.openDeleteData(
        this.User,
        openNewUser.id
      );
      console.log(
        `%c[ Data ] openDeletedUser`,
        "color: #E3DAC9;",
        openDeletedUser
      );
    },
    async testUHFile() {
      console.log(`%c[ View: AxiosTest ] testUHFile()`, `color:#BFFF00;`);
      // CREAT DATA
      const authNewUHFile = await this.authCreateData(
        this.UHFile,
        this.modelUHFile
      );
      console.log(`%c[ Data ] authNewUHFile`, "color: #E3DAC9;", authNewUHFile);
      const openNewUHFile = await this.openCreateData(
        this.UHFile,
        this.modelUHFile
      );
      console.log(`%c[ Data ] openNewUHFile`, "color: #E3DAC9;", openNewUHFile);
      // READ DATA
      const authUHFileList = await this.authReadDataList(this.UHFile);
      console.log(
        `%c[ Data ] authUHFileList`,
        "color: #E3DAC9;",
        authUHFileList
      );
      const openUHFileList = await this.openReadDataList(this.UHFile);
      console.log(
        `%c[ Data ] openUHFileList`,
        "color: #E3DAC9;",
        openUHFileList
      );
      const authUHFileItem = await this.authReadDataItemById(
        this.UHFile,
        authNewUHFile.id
      );
      console.log(
        `%c[ Data ] authUHFileItem`,
        "color: #E3DAC9;",
        authUHFileItem
      );
      const openUHFileItem = await this.openReadDataItemById(
        this.UHFile,
        openNewUHFile.id
      );
      console.log(
        `%c[ Data ] openUHFileItem`,
        "color: #E3DAC9;",
        openUHFileItem
      );
      // READ DATA BY USER_ID and FILE_ID
      const authReadUHFileListByUserId = await this.authReadUHFileListByUserId(
        0
      );
      console.log(
        `%c[ Data ] authReadUHFileListByUserId`,
        "color: #E3DAC9;",
        authReadUHFileListByUserId
      );
      const openReadUHFileListByUserId = await this.openReadUHFileListByUserId(
        1
      );
      console.log(
        `%c[ Data ] openReadUHFileListByUserId`,
        "color: #E3DAC9;",
        openReadUHFileListByUserId
      );
      const authReadUHFileListByFileId = await this.authReadUHFileListByFileId(
        0
      );
      console.log(
        `%c[ Data ] authReadUHFileListByFileId`,
        "color: #E3DAC9;",
        authReadUHFileListByFileId
      );
      const openReadUHFileListByFileId = await this.openReadUHFileListByFileId(
        0
      );
      console.log(
        `%c[ Data ] openReadUHFileListByFileId`,
        "color: #E3DAC9;",
        openReadUHFileListByFileId
      );

      // UPDATE DATA
      const authUpdatedUHFile = await this.authUpdateData(
        this.UHFile,
        authNewUHFile.id,
        this.modelUHFile
      );
      console.log(
        `%c[ Data ] authUpdatedUHFile`,
        "color: #E3DAC9;",
        authUpdatedUHFile
      );
      const openUpdatedUHFile = await this.openUpdateData(
        this.UHFile,
        openNewUHFile.id,
        this.modelUHFile
      );
      console.log(
        `%c[ Data ] openUpdatedUHFile`,
        "color: #E3DAC9;",
        openUpdatedUHFile
      );
      // DELETE DATA
      const authDeletedUHFile = await this.authDeleteData(
        this.UHFile,
        authNewUHFile.id
      );
      console.log(
        `%c[ Data ] authDeletedUHFile`,
        "color: #E3DAC9;",
        authDeletedUHFile
      );
      const openDeletedUHFile = await this.openDeleteData(
        this.UHFile,
        openNewUHFile.id
      );
      console.log(
        `%c[ Data ] openDeletedUHFile`,
        "color: #E3DAC9;",
        openDeletedUHFile
      );
    },
    async testWork() {
      console.log(`%c[ View: AxiosTest ] testWork()`, `color:#BFFF00;`);
      // CREAT DATA
      const authNewWork = await this.authCreateData(this.Work, this.modelWork);
      console.log(`%c[ Data ] authNewWork`, "color: #E3DAC9;", authNewWork);
      const openNewWork = await this.openCreateData(this.Work, this.modelWork);
      console.log(`%c[ Data ] openNewWork`, "color: #E3DAC9;", openNewWork);
      // READ DATA
      const authWorkList = await this.authReadDataList(this.Work);
      console.log(`%c[ Data ] authWorkList`, "color: #E3DAC9;", authWorkList);
      const openWorkList = await this.openReadDataList(this.Work);
      console.log(`%c[ Data ] openWorkList`, "color: #E3DAC9;", openWorkList);
      const authWorkItem = await this.authReadDataItemById(
        this.Work,
        authNewWork.id
      );
      console.log(`%c[ Data ] authWorkItem`, "color: #E3DAC9;", authWorkItem);
      const openWorkItem = await this.openReadDataItemById(
        this.Work,
        openNewWork.id
      );
      console.log(`%c[ Data ] openWorkItem`, "color: #E3DAC9;", openWorkItem);
      // UPDATE DATA
      const authUpdatedWork = await this.authUpdateData(
        this.Work,
        authNewWork.id,
        this.modelWork
      );
      console.log(
        `%c[ Data ] authUpdatedWork`,
        "color: #E3DAC9;",
        authUpdatedWork
      );
      const openUpdatedWork = await this.openUpdateData(
        this.Work,
        openNewWork.id,
        this.modelWork
      );
      console.log(
        `%c[ Data ] openUpdatedWork`,
        "color: #E3DAC9;",
        openUpdatedWork
      );
      // DELETE DATA
      const authDeletedWork = await this.authDeleteData(
        this.Work,
        authNewWork.id
      );
      console.log(
        `%c[ Data ] authDeletedWork`,
        "color: #E3DAC9;",
        authDeletedWork
      );
      const openDeletedWork = await this.openDeleteData(
        this.Work,
        openNewWork.id
      );
      console.log(
        `%c[ Data ] openDeletedWork`,
        "color: #E3DAC9;",
        openDeletedWork
      );
    },
    async testWHFile() {
      // CREAT DATA
      console.log(this.modelWHFile);
      const authNewWHFile = await this.authCreateData(
        this.WHFile,
        this.modelWHFile
      );
      console.log(`%c[ Data ] authNewWHFile`, "color: #E3DAC9;", authNewWHFile);
      const openNewWHFile = await this.openCreateData(
        this.WHFile,
        this.modelWHFile
      );
      console.log(`%c[ Data ] openNewWHFile`, "color: #E3DAC9;", openNewWHFile);
      // READ DATA
      const authWHFileList = await this.authReadDataList(this.WHFile);
      console.log(
        `%c[ Data ] authWHFileList`,
        "color: #E3DAC9;",
        authWHFileList
      );
      const openWHFileList = await this.openReadDataList(this.WHFile);
      console.log(
        `%c[ Data ] openWHFileList`,
        "color: #E3DAC9;",
        openWHFileList
      );
      const authWHFileItem = await this.authReadDataItemById(
        this.WHFile,
        authNewWHFile.id
      );
      console.log(
        `%c[ Data ] authWHFileItem`,
        "color: #E3DAC9;",
        authWHFileItem
      );
      const openWHFileItem = await this.openReadDataItemById(
        this.WHFile,
        openNewWHFile.id
      );
      console.log(
        `%c[ Data ] openWHFileItem`,
        "color: #E3DAC9;",
        openWHFileItem
      );
      // READ DATA BY WORK_ID and FILE_ID
      const authReadWHFileListByWorkId = await this.authReadWHFileListByWorkId(
        this.WHFile,
        authNewWHFile.work_id
      );
      console.log(
        `%c[ Data ] authReadWHFileListByWorkId`,
        "color: #E3DAC9;",
        authReadWHFileListByWorkId
      );
      const authReadWHFileListByFileId = await this.authReadWHFileListByFileId(
        this.WHFile,
        openNewWHFile.work_id
      );
      console.log(
        `%c[ Data ] authReadWHFileListByFileId`,
        "color: #E3DAC9;",
        authReadWHFileListByFileId
      );
      const openReadWHFileListByWorkId = await this.openReadWHFileListByWorkId(
        this.WHFile,
        authNewWHFile.file_id
      );
      console.log(
        `%c[ Data ] openReadWHFileListByWorkId`,
        "color: #E3DAC9;",
        openReadWHFileListByWorkId
      );
      const openReadWHFileListByFileId = await this.openReadWHFileListByFileId(
        this.WHFile,
        openNewWHFile.file_id
      );
      console.log(
        `%c[ Data ] openReadWHFileListByFileId`,
        "color: #E3DAC9;",
        openReadWHFileListByFileId
      );
      // UPDATE DATA
      const authUpdatedWHFile = await this.authUpdateData(
        this.WHFile,
        authNewWHFile.id,
        this.modelWHFile
      );
      console.log(
        `%c[ Data ] authUpdatedWHFile`,
        "color: #E3DAC9;",
        authUpdatedWHFile
      );
      const openUpdatedWHFile = await this.openUpdateData(
        this.WHFile,
        openNewWHFile.id,
        this.modelWHFile
      );
      console.log(
        `%c[ Data ] openUpdatedWHFile`,
        "color: #E3DAC9;",
        openUpdatedWHFile
      );
      // DELETE DATA
      const authDeletedWHFile = await this.authDeleteData(
        this.WHFile,
        authNewWHFile.id
      );
      console.log(
        `%c[ Data ] authDeletedWHFile`,
        "color: #E3DAC9;",
        authDeletedWHFile
      );
      const openDeletedWHFile = await this.openDeleteData(
        this.WHFile,
        openNewWHFile.id
      );
      console.log(
        `%c[ Data ] openDeletedWHFile`,
        "color: #E3DAC9;",
        openDeletedWHFile
      );
    },
    async testBizNews() {
      console.log(`%c[ View: AxiosTest ] testBizNews()`, `color:#BFFF00;`);
      // CREAT DATA
      const authNewBizNews = await this.authCreateData(
        this.BizNews,
        this.modelBizNews
      );
      console.log(
        `%c[ Data ] authNewBizNews`,
        "color: #E3DAC9;",
        authNewBizNews
      );
      const openNewBizNews = await this.openCreateData(
        this.BizNews,
        this.modelBizNews
      );
      console.log(
        `%c[ Data ] openNewBizNews`,
        "color: #E3DAC9;",
        openNewBizNews
      );
      // READ DATA
      const authBizNewsList = await this.authReadDataList(this.BizNews);
      console.log(
        `%c[ Data ] authBizNewsList`,
        "color: #E3DAC9;",
        authBizNewsList
      );
      const openBizNewsList = await this.openReadDataList(this.BizNews);
      console.log(
        `%c[ Data ] openBizNewsList`,
        "color: #E3DAC9;",
        openBizNewsList
      );
      const authBizNewsItem = await this.authReadDataItemById(
        this.BizNews,
        authNewBizNews.id
      );
      console.log(
        `%c[ Data ] authBizNewsItem`,
        "color: #E3DAC9;",
        authBizNewsItem
      );
      const openBizNewsItem = await this.openReadDataItemById(
        this.BizNews,
        openNewBizNews.id
      );
      console.log(
        `%c[ Data ] openBizNewsItem`,
        "color: #E3DAC9;",
        openBizNewsItem
      );
      // UPDATE DATA
      const authUpdatedBizNews = await this.authUpdateData(
        this.BizNews,
        authNewBizNews.id,
        this.modelBizNews
      );
      console.log(
        `%c[ Data ] authUpdatedBizNews`,
        "color: #E3DAC9;",
        authUpdatedBizNews
      );
      const openUpdatedBizNews = await this.openUpdateData(
        this.BizNews,
        openNewBizNews.id,
        this.modelBizNews
      );
      console.log(
        `%c[ Data ] openUpdatedBizNews`,
        "color: #E3DAC9;",
        openUpdatedBizNews
      );
      // DELETE DATA
      const authDeletedBizNews = await this.authDeleteData(
        this.BizNews,
        authNewBizNews.id
      );
      console.log(
        `%c[ Data ] authDeletedBizNews`,
        "color: #E3DAC9;",
        authDeletedBizNews
      );
      const openDeletedBizNews = await this.openDeleteData(
        this.BizNews,
        openNewBizNews.id
      );
      console.log(
        `%c[ Data ] openDeletedBizNews`,
        "color: #E3DAC9;",
        openDeletedBizNews
      );
    },
    async testBNHFile() {
      console.log(`%c[ View: AxiosTest ] testBNHFile()`, `color:#BFFF00;`);
      // CREAT DATA
      const authNewBNHFile = await this.authCreateData(
        this.BNHFile,
        this.modelBNHFile
      );
      console.log(
        `%c[ Data ] authNewBNHFile`,
        "color: #E3DAC9;",
        authNewBNHFile
      );

      const openNewBNHFile = await this.openCreateData(
        this.BNHFile,
        this.modelBNHFile
      );
      console.log(
        `%c[ Data ] openNewBNHFile`,
        "color: #E3DAC9;",
        openNewBNHFile
      );
      // READ DATA
      const authBNHFileList = await this.authReadDataList(this.BNHFile);
      console.log(
        `%c[ Data ] authBNHFileList`,
        "color: #E3DAC9;",
        authBNHFileList
      );
      const openBNHFileList = await this.openReadDataList(this.BNHFile);
      console.log(
        `%c[ Data ] openBNHFileList`,
        "color: #E3DAC9;",
        openBNHFileList
      );
      const authBNHFileItem = await this.authReadDataItemById(
        this.BNHFile,
        authNewBNHFile.id
      );
      console.log(
        `%c[ Data ] authBNHFileItem`,
        "color: #E3DAC9;",
        authBNHFileItem
      );
      const openBNHFileItem = await this.openReadDataItemById(
        this.BNHFile,
        openNewBNHFile.id
      );
      console.log(
        `%c[ Data ] openBNHFileItem`,
        "color: #E3DAC9;",
        openBNHFileItem
      );
      // READ DATA BY BIZNEWS_ID and FILE_ID
      const authBNHFileItemByBizNewsId =
        await this.authReadBNHFileListByBizNewsId(0);
      console.log(
        `%c[ Data ] authBNHFileItemByBizNewsId`,
        "color: #E3DAC9;",
        authBNHFileItemByBizNewsId
      );
      const openBNHFileItemByBizNewsId =
        await this.openReadBNHFileListByBizNewsId(0);
      console.log(
        `%c[ Data ] openBNHFileItemByBizNewsId`,
        "color: #E3DAC9;",
        openBNHFileItemByBizNewsId
      );
      const authBNHFileItemByFileId = await this.authReadBNHFileListByFileId(0);
      console.log(
        `%c[ Data ] authBNHFileItemByFileId`,
        "color: #E3DAC9;",
        authBNHFileItemByFileId
      );
      const openBNHFileItemByFileId = await this.openReadBNHFileListByFileId(0);
      console.log(
        `%c[ Data ] openBNHFileItemByFileId`,
        "color: #E3DAC9;",
        openBNHFileItemByFileId
      );

      // UPDATE DATA
      const authUpdatedBNHFile = await this.authUpdateData(
        this.BNHFile,
        authNewBNHFile.id,
        this.modelBNHFile
      );
      console.log(
        `%c[ Data ] authUpdatedBNHFile`,
        "color: #E3DAC9;",
        authUpdatedBNHFile
      );
      const openUpdatedBNHFile = await this.openUpdateData(
        this.BNHFile,
        openNewBNHFile.id,
        this.modelBNHFile
      );
      console.log(
        `%c[ Data ] openUpdatedBNHFile`,
        "color: #E3DAC9;",
        openUpdatedBNHFile
      );
      // DELETE DATA
      const authDeletedBNHFile = await this.authDeleteData(
        this.BNHFile,
        authNewBNHFile.id
      );
      console.log(
        `%c[ Data ] authDeletedBNHFile`,
        "color: #E3DAC9;",
        authDeletedBNHFile
      );
      const openDeletedBNHFile = await this.openDeleteData(
        this.BNHFile,
        openNewBNHFile.id
      );
      console.log(
        `%c[ Data ] openDeletedBNHFile`,
        "color: #E3DAC9;",
        openDeletedBNHFile
      );
    },
    async testFileCRUD_userProfile() {
      console.log(
        `%c[ View: AxiosTest ] testFileCRUD_userProfile()`,
        `color:#BFFF00;`
      );
      await this.setTempFileData(
        "yglee@neo-insp.com",
        "UP",
        this.userProfile,
        true
      );
      // CREAT DATA
      console.log(`%c[ View: AxiosTest ] CREAT User Profile`, `color:#BFFF00;`);
      const userFile = await this.createUserFile(
        1,
        "UP",
        this.userProfile.fileObject,
        this.userProfile.fileName,
        this.userProfile.file_title,
        this.userProfile.file_description,
        true
      );
      console.log(`%c[ Data ] userFile`, "color: #E3DAC9;", userFile);
      // READ DATA
      console.log(`%c[ View: AxiosTest ] READ User Profile`, `color:#BFFF00;`);
      const userFileList = await this.readUserFileList(1, "UP", true);
      console.log(`%c[ Data ] userFileList`, "color: #E3DAC9;", userFileList);
      // UPDATE DATA
      console.log(
        `%c[ View: AxiosTest ] UPDATE User Profile`,
        `color:#BFFF00;`
      );
      const updatedFile = await this.updateFile(
        userFile.id,
        this.userProfile.fileObject,
        this.userProfile.fileName,
        "수정된 타이틀",
        // this.userProfile.file_title,
        "수정된 파일설명",
        // this.userProfile.file_description,
        true
      );
      console.log(`%c[ Data ] updatedFile`, "color: #E3DAC9;", updatedFile);
      // DELETE DATA
      console.log(
        `%c[ View: AxiosTest ] DELETE User Profile`,
        `color:#BFFF00;`
      );
      const deleteFileResult = await this.deleteFile(userFile.id, true);
      console.log(
        `%c[ Data ] deleteFileResult`,
        "color: #E3DAC9;",
        deleteFileResult
      );
    },
    async testFileCRUD_workRefImg() {
      console.log(
        `%c[ View: AxiosTest ] testFileCRUD_workRefImg()`,
        `color:#BFFF00;`
      );
      await this.setTempFileData(
        "yglee@neo-insp.com",
        "WR",
        this.workRefImg,
        true
      );
      // CREAT DATA
      console.log(`%c[ View: AxiosTest ] CREAT workRefImg`, `color:#BFFF00;`);
      const workRefImg = await this.createWorkFile(
        1,
        "WR",
        this.workRefImg.fileObject,
        this.workRefImg.fileName,
        this.workRefImg.file_title,
        this.workRefImg.file_description,
        true
      );
      console.log(`%c[ Data ] workRefImg`, "color: #E3DAC9;", workRefImg);
      // READ DATA
      console.log(`%c[ View: AxiosTest ] READ workRefImg`, `color:#BFFF00;`);
      const workRefImgList = await this.readWorkFileList(1, "WR", true);
      console.log(
        `%c[ Data ] workRefImgList`,
        "color: #E3DAC9;",
        workRefImgList
      );

      // UPDATE DATA
      console.log(`%c[ View: AxiosTest ] UPDATE workRefImg`, `color:#BFFF00;`);
      const updatedFile = await this.updateFile(
        workRefImg.id,
        this.workRefImg.fileObject,
        this.workRefImg.fileName,
        "수정된 타이틀",
        // this.workRefImg.file_title,
        "수정된 파일설명",
        // this.workRefImg.file_description,
        true
      );
      console.log(`%c[ Data ] updatedFile`, "color: #E3DAC9;", updatedFile);
      // DELETE DATA
      console.log(`%c[ View: AxiosTest ] DELETE WorkRefImg`, `color:#BFFF00;`);
      const deleteFileResult = await this.deleteFile(workRefImg.id, true);
      console.log(
        `%c[ Data ] deleteFileResult`,
        "color: #E3DAC9;",
        deleteFileResult
      );
    },
    async testFileCRUD_workPortfolio() {
      console.log(
        `%c[ View: AxiosTest ] testFileCRUD_workPortfolio()`,
        `color:#BFFF00;`
      );
      await this.setTempFileData(
        "yglee@neo-insp.com",
        "WP",
        this.workPortfolio,
        true
      );
      // CREAT DATA
      console.log(
        `%c[ View: AxiosTest ] CREAT workPortfolio`,
        `color:#BFFF00;`
      );
      const workPortfolio = await this.createWorkFile(
        1,
        "WP",
        this.workPortfolio.fileObject,
        this.workPortfolio.fileName,
        this.workPortfolio.file_title,
        this.workPortfolio.file_description,
        true
      );
      console.log(`%c[ Data ] workPortfolio`, "color: #E3DAC9;", workPortfolio);
      // READ DATA
      console.log(`%c[ View: AxiosTest ] READ workPortfolio`, `color:#BFFF00;`);
      const workPortfolioList = await this.readWorkFileList(1, "WP", true);
      console.log(
        `%c[ Data ] workPortfolioList`,
        "color: #E3DAC9;",
        workPortfolioList
      );
      // UPDATE DATA
      console.log(
        `%c[ View: AxiosTest ] UPDATE workPortfolio`,
        `color:#BFFF00;`
      );
      const updatedFile = await this.updateFile(
        workPortfolio.id,
        this.workPortfolio.fileObject,
        this.workPortfolio.fileName,
        "수정된 타이틀",
        // this.workPortfolio.file_title,
        "수정된 파일설명",
        // this.workPortfolio.file_description,
        true
      );
      console.log(`%c[ Data ] updatedFile`, "color: #E3DAC9;", updatedFile);
      // DELETE DATA
      console.log(
        `%c[ View: AxiosTest ] DELETE WorkPortfolio`,
        `color:#BFFF00;`
      );
      const deleteFileResult = await this.deleteFile(workPortfolio.id, true);
      console.log(
        `%c[ Data ] deleteFileResult`,
        "color: #E3DAC9;",
        deleteFileResult
      );
    },
    async testFileCRUD_biznewsRef() {
      console.log(
        `%c[ View: AxiosTest ] testFileCRUD_biznewsRef()`,
        `color:#BFFF00;`
      );
      await this.setTempFileData(
        "yglee@neo-insp.com",
        "BR",
        this.biznewsRef,
        true
      );
      // CREAT DATA
      console.log(`%c[ View: AxiosTest ] CREAT biznewsRef`, `color:#BFFF00;`);
      const biznewsRef = await this.createBizNewsFile(
        1,
        "BR",
        this.biznewsRef.fileObject,
        this.biznewsRef.fileName,
        this.biznewsRef.file_title,
        this.biznewsRef.file_description,
        true
      );
      console.log(`%c[ Data ] biznewsRef`, "color: #E3DAC9;", biznewsRef);
      // READ DATA
      console.log(`%c[ View: AxiosTest ] READ biznewsRef`, `color:#BFFF00;`);
      const biznewsRefList = await this.readBizNewsFileList(1, "BR", true);
      console.log(
        `%c[ Data ] biznewsRefList`,
        "color: #E3DAC9;",
        biznewsRefList
      );
      // UPDATE DATA
      console.log(`%c[ View: AxiosTest ] UPDATE biznewsRef`, `color:#BFFF00;`);
      const updatedFile = await this.updateFile(
        biznewsRef.id,
        this.biznewsRef.fileObject,
        this.biznewsRef.fileName,
        "수정된 타이틀",
        // this.biznewsRef.file_title,
        "수정된 파일설명",
        // this.biznewsRef.file_description,
        true
      );
      console.log(`%c[ Data ] updatedFile`, "color: #E3DAC9;", updatedFile);
      // DELETE DATA
      console.log(`%c[ View: AxiosTest ] DELETE biznewsRef`, `color:#BFFF00;`);
      const deleteFileResult = await this.deleteFile(biznewsRef.id, true);
      console.log(
        `%c[ Data ] deleteFileResult`,
        "color: #E3DAC9;",
        deleteFileResult
      );
    },
  },
};
</script>

<style></style>
