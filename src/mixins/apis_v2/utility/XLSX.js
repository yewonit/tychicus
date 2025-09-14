import { CustomLoger } from "@/mixins/apis_v2/utility/CustomLoger";
import { ArrayCtrl } from "@/mixins/apis_v2/utility/ArrayCtrl";
import { StringCtrl } from "@/mixins/apis_v2/utility/StringCtrl";

// XLSX.js 파일을 추가한다.

export const XLSX = {
  data() {
    return {
      business_domain_lv1_table: [
        { text: "서비스업", value: 100 },
        { text: "금융∙은행업", value: 200 },
        { text: "IT∙정보통신업", value: 300 },
        { text: "판매유통업", value: 400 },
        { text: "제조∙생산∙화학업", value: 500 },
        { text: "교육업", value: 600 },
        { text: "건설업", value: 700 },
        { text: "의료∙제약업", value: 800 },
        { text: "미디어∙광고업", value: 900 },
        { text: "문화∙예술∙디자인업", value: 1000 },
        { text: "기관∙협회", value: 1100 },
      ],
      business_domain_lv2_table: [],
      business_domain_lv2_1_table: [
        { text: "호텔∙여행∙항공", value: 101 },
        { text: "음식료∙외식∙프랜차이즈", value: 102 },
        { text: "스포츠∙여가∙레저", value: 103 },
        { text: "뷰티∙미용", value: 104 },
        { text: "콜센터∙아웃소싱∙기타", value: 105 },
        { text: "정비∙A/S∙카센터", value: 106 },
        { text: "렌탈∙임대∙리스", value: 107 },
        { text: "서치펌∙헤드헌팅", value: 108 },
        { text: "시설관리∙보안∙경비", value: 109 },
        { text: "웨딩∙상조∙이벤트", value: 110 },
      ],
      business_domain_lv2_2_table: [
        { text: "은행∙금융", value: 201 },
        { text: "캐피탈∙대출", value: 202 },
        { text: "증권∙보험∙카드", value: 203 },
      ],
      business_domain_lv2_3_table: [
        { text: "솔루션∙SI∙CRM∙ERP", value: 301 },
        { text: "웹에이전시", value: 302 },
        { text: "쇼핑몰∙오픈마켓∙소셜커머스", value: 303 },
        { text: "포털∙컨텐츠∙커뮤니티", value: 304 },
        { text: "네트워크∙통신서비스", value: 305 },
        { text: "정보보안", value: 306 },
        { text: "컴퓨터∙하드웨어∙장비", value: 307 },
        { text: "게임∙애니메이션", value: 308 },
        { text: "모바일∙APP", value: 309 },
        { text: "IT컨설팅", value: 310 },
      ],
      business_domain_lv2_4_table: [
        { text: "백화점∙유통∙도소매", value: 401 },
        { text: "무역∙상사", value: 402 },
        { text: "물류∙운송∙배송", value: 403 },
      ],
      business_domain_lv2_5_table: [
        { text: "전기∙전자∙제어", value: 501 },
        { text: "반도체∙디스플레이∙광학", value: 502 },
        { text: "기계∙기계설비", value: 503 },
        { text: "자동차∙조선∙철강∙항공", value: 504 },
        { text: "금속∙재료∙자재", value: 505 },
        { text: "화학∙에너지∙환경", value: 506 },
        { text: "섬유∙의류∙패션", value: 507 },
        { text: "생활화학∙화장품", value: 508 },
        { text: "생활용품∙소비재∙기타", value: 509 },
        { text: "목재∙제자∙가구", value: 510 },
        { text: "식품가공", value: 511 },
        { text: "농축산∙어업∙임업", value: 512 },
      ],
      business_domain_lv2_6_table: [
        { text: "학교(초∙중∙고∙대학∙특수)", value: 601 },
        { text: "유아∙유치원∙어린이집", value: 602 },
        { text: "학원∙어하원∙교육원", value: 603 },
        { text: "학습지∙방문교육", value: 604 },
      ],
      business_domain_lv2_7_table: [
        { text: "건축∙설비∙환경", value: 701 },
        { text: "건설∙시공∙토목∙조경", value: 702 },
        { text: "인테리어∙자재", value: 703 },
        { text: "부동산∙중개∙임대", value: 704 },
      ],
      business_domain_lv2_8_table: [
        { text: "의료(병원분류별)", value: 801 },
        { text: "의료(진료과별)", value: 802 },
        { text: "의료(간호∙원무∙상담)", value: 803 },
        { text: "제약∙보건∙바이오", value: 804 },
        { text: "사회복지∙요양", value: 805 },
      ],
      business_domain_lv2_9_table: [
        { text: "방송∙케이블∙프로덕션", value: 901 },
        { text: "신문∙잡지∙언론사", value: 902 },
        { text: "광고∙홍보∙전시", value: 903 },
        { text: "영화∙음반∙배급", value: 904 },
        { text: "연예∙엔터테인먼트", value: 905 },
        { text: "출판∙인쇄∙사진", value: 906 },
      ],
      business_domain_lv2_10_table: [
        { text: "문화∙공연∙예술", value: 1001 },
        { text: "디자인∙CAD", value: 1002 },
      ],
      business_domain_lv2_11_table: [
        { text: "공기업∙공공기관", value: 1101 },
        { text: "협회∙단체", value: 1102 },
        { text: "컨설팅∙연구∙조사", value: 1103 },
        { text: "회계∙세무∙법무", value: 1104 },
        { text: "연예∙엔터테인먼트", value: 1105 },
        { text: "출판∙인쇄∙사진", value: 1106 },
      ],
      business_domain_table: [
        { text: "건설", value: 100 },
        { text: "경찰", value: 200 },
        { text: "공공", value: 300 },
        { text: "공기업", value: 400 },
        { text: "공연예술", value: 500 },
        { text: "광고 & 마케팅", value: 600 },
        { text: "교육", value: 700 },
        { text: "상담", value: 800 },
        { text: "기관 & 협회", value: 900 },
        { text: "유통 & 물류", value: 1000 },
        { text: "문화 & 예술", value: 1100 },
        { text: "미디어", value: 1200 },
        { text: "디자인", value: 1300 },
        { text: "방송", value: 1400 },
        { text: "행사", value: 1500 },
        { text: "법률 & 법조", value: 1600 },
        { text: "부동산", value: 1700 },
        { text: "사회복지", value: 1800 },
        { text: "서비스", value: 1900 },
        { text: "세관", value: 2000 },
        { text: "세무 & 회계", value: 2100 },
        { text: "스포츠", value: 2200 },
        { text: "식품", value: 2300 },
        { text: "에너지", value: 2400 },
        { text: "애니메이션", value: 2500 },
        { text: "연구개발", value: 2600 },
        { text: "연예계", value: 2700 },
        { text: "은행 & 금융", value: 2800 },
        { text: "음악", value: 2900 },
        { text: "의료", value: 3000 },
        { text: "제약", value: 3100 },
        { text: "패션 & 의류", value: 3200 },
        { text: "제조 & 화학", value: 3300 },
        { text: "춤 & 댄스", value: 3400 },
        { text: "판매 & 유통", value: 3500 },
        { text: "항공", value: 3600 },
        { text: "해충 & 방역", value: 3700 },
        { text: "감사 & 컨설팅", value: 3800 },
        { text: "IT & 웹", value: 3900 },
        { text: "통신", value: 4000 },
      ],
      job_domain_table: [
        { text: "IT & 인터넷", value: 100 },
        { text: "감정 & 평가", value: 200 },
        { text: "건설", value: 300 },
        { text: "경영 & 사무", value: 400 },
        { text: "경찰", value: 500 },
        { text: "교육", value: 600 },
        { text: "군인", value: 700 },
        { text: "디자인", value: 800 },
        { text: "마케팅", value: 900 },
        { text: "문화예술", value: 1000 },
        { text: "미디어", value: 1100 },
        { text: "법무 & 법조", value: 1200 },
        { text: "부동산", value: 1300 },
        { text: "사회복지", value: 1400 },
        { text: "상담", value: 1500 },
        { text: "생산 & 제조", value: 1600 },
        { text: "서비스", value: 1700 },
        { text: "세관", value: 1800 },
        { text: "세무 & 회계", value: 1900 },
        { text: "스포츠", value: 2000 },
        { text: "심리상담", value: 2100 },
        { text: "안전 & 환경", value: 2200 },
        { text: "연구", value: 2300 },
        { text: "연예", value: 2400 },
        { text: "영업 & 고객상담", value: 2500 },
        { text: "요식업", value: 2600 },
        { text: "유통 & 무역", value: 2700 },
        { text: "음악", value: 2800 },
        { text: "의료", value: 2900 },
        { text: "인사", value: 3000 },
        { text: "소매 & 도매", value: 3100 },
        { text: "컨설팅", value: 3200 },
        { text: "특수계층 & 공공", value: 3300 },
        { text: "항공", value: 3400 },
      ],
      job_position_table: [
        { text: "미등록", value: 0 },
        { text: "대표", value: 100 },
        { text: "임원", value: 200 },
        { text: "중간관리자(부차과장 등)", value: 300 },
        { text: "대리", value: 13 },
        { text: "주임", value: 14 },
        { text: "매니저", value: 15 },
        { text: "사원", value: 16 },
        { text: "인턴", value: 17 },
        { text: "프리렌서", value: 18 },
      ],
      work_table: [
        { text: "법인사업자", value: "CB" },
        { text: "개인사업자", value: "PB" },
        { text: "협회 및 단체", value: "EP" },
        { text: "정규직 직원", value: "RE" },
        { text: "계약직 직원", value: "TE" },
        { text: "아르바이트", value: "AB" },
        { text: "프리렌서", value: "FR" },
        { text: "기타", value: "EC" },
      ],
      authority_table_table: [
        { text: "일반회원", value: "1" },
        { text: "비즈니스등록회원", value: "2" },
        { text: "정회원", value: "3" },
        { text: "일반관리자A", value: "4" },
        { text: "일반관리자B", value: "5" },
        { text: "중급관리자A", value: "6" },
        { text: "중급관리자B", value: "7" },
        { text: "최고관리자", value: "8" },
        { text: "SystemMaster", value: "9" },
      ],
      career_table: [
        { text: "1년 미만", value: 10 },
        { text: "1년 이상 3년 미만", value: 20 },
        { text: "3년 이상 5년 미만", value: 30 },
        { text: "5년 이상 10년 미만", value: 40 },
        { text: "10년 이상", value: 50 },
      ],
    };
  },
  mixins: [CustomLoger, ArrayCtrl, StringCtrl],
  methods: {
    /**
     * @description 매계번수로 받은 제이슨 데이터를 XLSX로 엑셀파일로 변환하여 다운로드한다.
     * @param {json} json
     * @param {string} fileName
     * @param {string} sheetName
     */
    async downloadExcel(json, fileName, sheetName) {
      this.lv2_Func("mixins : XLSX", "downloadExcel()");
      this.lv2_Data("json", json);
      this.lv2_Data("fileName", fileName);
      this.lv2_Data("sheetName", sheetName);

      const workList = await this.processWorkList(json);

      const XLSX = require("xlsx");
      this.lv2_Data("XLSX", XLSX);

      const wb = XLSX.utils.book_new();

      const ws = XLSX.utils.json_to_sheet(workList);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);
    },

    async processWorkList(workListJson) {
      this.lv2_Func("mixins : XLSX", "processWorkList()");
      this.lv2_Data("workListJson", workListJson);

      let workList = workListJson;
      this.lv2_Data("workList", workList);

      // STEP1. json.business_domain_lv1_idx 값을 this.business_domain_lv1_table의 text로 변경
      for (let i = 0; i < workList.length; i++) {
        if (workList[i].business_domain_lv1_idx != null) {
          switch (workList[i].business_domain_lv1_idx) {
            case "100":
              this.lv1_Data("business_domain_lv1_idx", "100");
              workList[i].business_domain_lv1_idx = "서비스업";
              this.business_domain_lv2_1_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "200":
              workList[i].business_domain_lv1_idx = "금융∙은행업";
              this.business_domain_lv2_2_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "300":
              workList[i].business_domain_lv1_idx = "IT∙정보통신업";
              this.business_domain_lv2_3_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "400":
              workList[i].business_domain_lv1_idx = "판매유통업";
              this.business_domain_lv2_4_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "500":
              workList[i].business_domain_lv1_idx = "제조∙생산∙화학업";
              this.business_domain_lv2_5_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "600":
              workList[i].business_domain_lv1_idx = "교육업";
              this.business_domain_lv2_6_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "700":
              workList[i].business_domain_lv1_idx = "건설업";
              this.business_domain_lv2_7_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "800":
              workList[i].business_domain_lv1_idx = "의료∙제약업";
              this.business_domain_lv2_8_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "900":
              workList[i].business_domain_lv1_idx = "미디어∙광고업";
              this.business_domain_lv2_9_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "1000":
              workList[i].business_domain_lv1_idx = "문화∙예술∙디자인업";
              this.business_domain_lv2_10_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            case "1100":
              workList[i].business_domain_lv1_idx = "기관∙협회";
              this.business_domain_lv2_11_table.forEach((item) => {
                if (item.value == workList[i].business_domain_lv2_idx) {
                  workList[i].business_domain_lv2_idx = item.text;
                }
              });
              break;
            default:
              workList[i].business_domain_lv1_idx = "기타";
              workList[i].business_domain_lv2_idx = "기타";

              break;
          }
        }
      }

      // STEP2. json.career_type 값을 this.career_table의 text로 변경
      for (let i = 0; i < workList.length; i++) {
        if (workList[i].career_type != null) {
          this.career_table.forEach((item) => {
            if (item.value == workList[i].career_type) {
              workList[i].career_type = item.text;
            }
          });
        }
      }

      // STEP3. json.work_type 값을 this.work_type_table의 text로 변경
      for (let i = 0; i < workList.length; i++) {
        if (workList[i].work_type != null) {
          this.work_table.forEach((item) => {
            if (item.value == workList[i].work_type) {
              workList[i].work_type = item.text;
            }
          });
        }
      }

      // STEP4. json.job_position_idx 값을 this.job_position_table text로 변경
      for (let i = 0; i < workList.length; i++) {
        if (workList[i].job_position_idx != null) {
          this.job_position_table.forEach((item) => {
            if (item.value == workList[i].job_position_idx) {
              workList[i].job_position_idx = item.text;
            }
          });
        }
      }

      return workList;
    },
  },
};
