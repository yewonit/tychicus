import { AuthCtrl } from "@/mixins/apis_v2/internal/core/AuthCtrl";

export const ModelCtrl = {
  data() {
    return {};
  },
  mixins: [AuthCtrl],
  created() {},
  methods: {
    // CREAT
    // 인증되지 않은 사용자를 위한 정보 생성 API "use OPEN_AXIOS"
    async openCreateModel(url, model, showLog) {
      if (showLog) {
        console.log(
          `%c[ mixins: ModelCtrl ] [ ` +
            `%c${url}` +
            `%c ] openCreateModel model :`,
          `color: #008080;`,
          `color: #008080;`,
          `color: #008080;`,
          model
        );
      }
      await this.setAxios("open", showLog);
      let tempData = null;
      await this.OPEN_AXIOS.post(url, model)
        .then((res) => {
          if (showLog) {
            console.log(
              `%c[ ` + `%c${url}` + `%c ] openCreateModel res :`,
              `color: #008080;`,
              `color: #008080;`,
              `color: #008080;`,
              res
            );
          }
          tempData = res;
        })
        .catch((err) => {
          console.log(
            `%c[ Error ] [ ${url} ] Open Create err : ${err}`,
            `color: #FD1C03;`
          );
        });
      this.clearAxios(showLog);
      return tempData;
    },
    // READ
    // 인증된 사용자를 위한 정보 조회 API "use AUTH_AXIOS"
    async openReadModel(url, paramsObject = undefined, showLog = false) {
      if (showLog) {
        console.log(
          `%c[ mixins: ModelCtrl ] [ %c${url} %c] openReadModel`,
          `color: #008080;`,
          `color: #008080;`,
          `color: #008080;`
        );
      }

      try {
        await this.setAxios("open", showLog);
        const res = await this.OPEN_AXIOS.get(url, paramsObject);
        if (showLog) {
          console.log(`%c[ read res ] :`, `color: #008080;`, res);
        }
        return res;
      } catch (err) {
        console.log(
          `%c[ Error ] [ ${url} ] Open Read err : ${err}`,
          `color: #FD1C03;`
        );
        return null; // Or a more meaningful error response
      } finally {
        this.clearAxios(showLog);
      }
    },
    // UPDATE
    // 인증되지 않은 사용자를 위한 정보 수정 API "use OPEN_AXIOS"
    async openUpdateModel(url, modelWithId, showLog) {
      if (showLog) {
        console.log(
          `%c[ mixins: ModelCtrl ] [ ` +
            `%c${url}` +
            `%c ] openUpdateModel modelWithId :`,
          `color: #008080;`,
          `color: #008080;`,
          `color: #008080;`,
          modelWithId
        );
      }
      await this.setAxios("open", showLog);
      let tempData = null;
      await this.OPEN_AXIOS.put(url, modelWithId)
        .then((res) => {
          if (showLog) {
            console.log(
              `%c[ ` + `%cupdate res` + `%c ] :`,
              `color: #008080;`,
              `color: #008080;`,
              `color: #008080;`,
              res
            );
          }
          tempData = res;
        })
        .catch((err) => {
          console.log(
            `%c[ Error ] [ ${url} ] Open Update err : ${err}`,
            `color: #FD1C03;`
          );
        });
      this.clearAxios(showLog);
      return tempData;
    },
    // DELETE
    // 인증되지 않은 사용자를 위한 정보 삭제 API "use OPEN_AXIOS"
    async openDeleteModel(url, dataObject, showLog) {
      if (showLog) {
        console.log(
          `%c[ mixins: ModelCtrl ] [ ` +
            `%c${url}` +
            `%c ] openDeleteModel dataObject :`,
          `color: #008080;`,
          `color: #008080;`,
          `color: #008080;`,
          dataObject
        );
      }
      await this.setAxios("open", showLog);
      let tempData = null;
      await this.OPEN_AXIOS.delete(url, { data: dataObject.data })
        .then((res) => {
          if (showLog) {
            console.log(
              `%c[ ` + `%cdelete res` + `%c ] :`,
              `color: #008080;`,
              `color: #008080;`,
              `color: #008080;`,
              res
            );
          }
          tempData = res;
        })
        .catch((err) => {
          console.log(
            `%c[ Error ] [ ${url} ] Open Delete err : ${err}`,
            `color: #FD1C03;`
          );
        });
      this.clearAxios(showLog);
      return tempData;
    },
  },
};
