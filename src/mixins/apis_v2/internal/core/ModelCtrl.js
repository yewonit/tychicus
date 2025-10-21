import { AuthCtrl } from '@/mixins/apis_v2/internal/core/AuthCtrl';

export const ModelCtrl = {
  data() {
    return {};
  },
  mixins: [AuthCtrl],
  created() {},
  methods: {
    // CREAT
    // 인증되지 않은 사용자를 위한 정보 생성 API "use OPEN_AXIOS"
    async openCreateModel(url, model) {
      await this.setAxios('open');
      let tempData = null;
      await this.OPEN_AXIOS.post(url, model)
        .then((res) => {
          tempData = res;
        })
        .catch(() => {});
      this.clearAxios();
      return tempData;
    },
    // READ
    // 인증된 사용자를 위한 정보 조회 API "use AUTH_AXIOS"
    async openReadModel(url, paramsObject = undefined) {
      try {
        await this.setAxios('open');
        const res = await this.OPEN_AXIOS.get(url, paramsObject);
        return res;
      } catch {
        return null; // Or a more meaningful error response
      } finally {
        this.clearAxios();
      }
    },
    // UPDATE
    // 인증되지 않은 사용자를 위한 정보 수정 API "use OPEN_AXIOS"
    async openUpdateModel(url, modelWithId) {
      await this.setAxios('open');
      let tempData = null;
      await this.OPEN_AXIOS.put(url, modelWithId)
        .then((res) => {
          tempData = res;
        })
        .catch(() => {});
      this.clearAxios();
      return tempData;
    },
    // DELETE
    // 인증되지 않은 사용자를 위한 정보 삭제 API "use OPEN_AXIOS"
    async openDeleteModel(url, dataObject) {
      await this.setAxios('open');
      let tempData = null;
      await this.OPEN_AXIOS.delete(url, { data: dataObject.data })
        .then((res) => {
          tempData = res;
        })
        .catch(() => {});
      this.clearAxios();
      return tempData;
    },
  },
};
