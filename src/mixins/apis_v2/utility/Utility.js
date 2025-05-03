import { CustomLoger } from "@/mixins/apis_v2/utility/CustomLoger";
import { ArrayCtrl } from "@/mixins/apis_v2/utility/ArrayCtrl";
import { StringCtrl } from "@/mixins/apis_v2/utility/StringCtrl";

export const Utility = {
  data() {
    return {};
  },
  mixins: [CustomLoger, ArrayCtrl, StringCtrl],
  methods: {
    // 클립보드에 현재 위차한 페이지의 Url을 복사한다.
    copyUrl() {
      let url = window.location.href;
      let input = document.createElement("input");
      input.setAttribute("value", url);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);

      alert("페이지 주소가 클립보드에 복사되었습니다.");
    },

    // 파일 업로드 시 임시데이터들을 생성하는 함수
    setTempFileData(userEmail, fileFor, file, showLog) {
      if (showLog) {
        console.log(
          `%c[ mixins: Utility ] setTempFileData() file [체크] :`,
          `color:#BFFF00;`,
          file
        );
      }
      // 업로드된 파일이 없다면 조기에 함수를 종료다.
      if (file.fileObject == null) {
        if (showLog) {
          console.log(`%c[ Data ] file`, "color: #E3DAC9;", file);
          console.log(
            `%c[ Action ] 업로드된 파일이 없음으로 임시 데이터를 생성하지 않습니다.`,
            `color:#BFFF00;`,
            file
          );
        }
        return;
      }
      file.tempUrl = "";
      // file.tempUrl = URL.createObjectURL(file.fileObject);
      this.$set(file, "tempUrl", URL.createObjectURL(file.fileObject));
      // 랜덤한 파일 이름을 생성하고 현재시각을 포함해 파일 이름을 생성합니다.
      file.fileName =
        userEmail +
        "_" +
        fileFor +
        "_" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        "_" +
        new Date().getTime();
      if (showLog) {
        console.log(`%c[ Data ] file`, "color: #E3DAC9;", file);
      }
    },

    // 주소 입력 처리 공통 함수
    handleAddressInput(data, target) {
      if (data.userSelectedType === "R") {
        target.address = data.roadAddress;
      } else {
        target.address = data.jibunAddress;
      }
      target.zip_postal_code = data.zonecode;
    },

    // 데이터 ��증 로직 통합
    validateRequiredFields(fields) {
      for (const field of fields) {
        if (!field.value) {
          alert(`${field.label}을(를) 입력해주세요.`);
          return false;
        }
      }
      return true;
    },
  },
};
