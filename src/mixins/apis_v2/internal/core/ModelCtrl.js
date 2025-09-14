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
      await this.setAxios("open", showLog);
      let tempData = null;
      await this.OPEN_AXIOS.post(url, model)
        .then((res) => {
          tempData = res;
        })
        .catch((err) => {});
      this.clearAxios(showLog);
      return tempData;
    },
    // READ
    // 인증된 사용자를 위한 정보 조회 API "use AUTH_AXIOS"
    async openReadModel(url, paramsObject = undefined, showLog = false) {
      try {
        await this.setAxios("open", showLog);
        const res = await this.OPEN_AXIOS.get(url, paramsObject);
        if (showLog) {
        }
        return res;
      } catch (err) {
        return null; // Or a more meaningful error response
      } finally {
        this.clearAxios(showLog);
      }
    },
    // UPDATE
    // 인증되지 않은 사용자를 위한 정보 수정 API "use OPEN_AXIOS"
    async openUpdateModel(url, modelWithId, showLog) {
      await this.setAxios("open", showLog);
      let tempData = null;
      await this.OPEN_AXIOS.put(url, modelWithId)
        .then((res) => {
          tempData = res;
        })
        .catch((err) => {});
      this.clearAxios(showLog);
      return tempData;
    },
    // DELETE
    // 인증되지 않은 사용자를 위한 정보 삭제 API "use OPEN_AXIOS"
    async openDeleteModel(url, dataObject, showLog) {
      await this.setAxios("open", showLog);
      let tempData = null;
      await this.OPEN_AXIOS.delete(url, { data: dataObject.data })
        .then((res) => {
          tempData = res;
        })
        .catch((err) => {});
      this.clearAxios(showLog);
      return tempData;
    },
  },
};
