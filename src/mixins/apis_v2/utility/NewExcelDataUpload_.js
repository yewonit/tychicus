import { CustomLoger } from '@/mixins/apis_v2/utility/CustomLoger';
import { ArrayCtrl } from '@/mixins/apis_v2/utility/ArrayCtrl';
import { StringCtrl } from '@/mixins/apis_v2/utility/StringCtrl';

import { MasterCtrl } from '@/mixins/apis_v2/internal/MasterCtrl';
import { AWSS3Ctrl } from '@/mixins/apis_v2/external/AWSS3Ctrl';
import { Utility } from '@/mixins/apis_v2/utility/Utility';

// XLSX.js 파일을 추가한다.

export const NewExcelDataUpload = {
  data() {
    return {
      newUserDataByExcel: [
        {
          id: 1,
          organization_name: '41 이상 여전도회',
          role: '회장',
          church_office: '권사',
          name: '김정자',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01056553125',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 2,
          organization_name: '41 이상 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '윤영숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01046964059',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 3,
          organization_name: '41 이상 여전도회',
          role: '총무',
          church_office: '권사',
          name: '박연순',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01090901942',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 4,
          organization_name: '42부터 44 여전도회',
          role: '회장',
          church_office: '권사',
          name: '홍정자',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01091851555',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 5,
          organization_name: '42부터 44 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '이삼임',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01080096866',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 6,
          organization_name: '42부터 44 여전도회',
          role: '총무',
          church_office: '권사',
          name: '안인숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01092644818',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 7,
          organization_name: '45부터 46 여전도회',
          role: '회장',
          church_office: '권사',
          name: '이영자',
          name_suffix: 'E',
          region: 'Unknown',
          phone_number: '01065885949',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 8,
          organization_name: '45부터 46 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '조순자',
          name_suffix: 'C',
          region: 'Unknown',
          phone_number: '01085552073',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 9,
          organization_name: '45부터 46 여전도회',
          role: '총무',
          church_office: '권사',
          name: '이선자',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01067509878',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 10,
          organization_name: '47 여전도회',
          role: '회장',
          church_office: '권사',
          name: '심규숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01027250157',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 11,
          organization_name: '47 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '박순례',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01047406544',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 12,
          organization_name: '47 여전도회',
          role: '총무',
          church_office: '권사',
          name: '석춘임',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01091411556',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 13,
          organization_name: '48 여전도회',
          role: '회장',
          church_office: '권사',
          name: '백형순',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01055186889',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 14,
          organization_name: '48 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '송필여',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01047649728',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 15,
          organization_name: '48 여전도회',
          role: '총무',
          church_office: '권사',
          name: '김정애',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01056479712',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 16,
          organization_name: '49 여전도회',
          role: '회장',
          church_office: '권사',
          name: '남궁경숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01032657799',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 17,
          organization_name: '49 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '선호숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01082321469',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 18,
          organization_name: '49 여전도회',
          role: '총무',
          church_office: '권사',
          name: '오옥봉',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01099772433',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 19,
          organization_name: '50 여전도회',
          role: '회장',
          church_office: '권사',
          name: '정옥순',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01042572604',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 20,
          organization_name: '50 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '유시원',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01024471436',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 21,
          organization_name: '50 여전도회',
          role: '총무',
          church_office: '권사',
          name: '최순녀',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01091666029',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 22,
          organization_name: '51 여전도회',
          role: '회장',
          church_office: '권사',
          name: '정옥매',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01028658107',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 23,
          organization_name: '51 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '조한녀',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01066441978',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 24,
          organization_name: '51 여전도회',
          role: '총무',
          church_office: '권사',
          name: '신효숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01090083131',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 25,
          organization_name: '52A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '최홍숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01034300356',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 26,
          organization_name: '52A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '윤석자',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01082429380',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 27,
          organization_name: '52A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '이공례',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01053200310',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 28,
          organization_name: '52B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '송숙자',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01058785296',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 29,
          organization_name: '52B 여전도회',
          role: '부회장',
          church_office: '장로',
          name: '박란희',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01052168191',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 30,
          organization_name: '52B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '김나현',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01066648112',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 31,
          organization_name: '53 여전도회',
          role: '회장',
          church_office: '권사',
          name: '이혜숙',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01063212494',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 32,
          organization_name: '53 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '도진숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01083163927',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 33,
          organization_name: '53 여전도회',
          role: '총무',
          church_office: '권사',
          name: '원옥주',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01063580492',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 34,
          organization_name: '55A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '한진숙',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01087033022',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 35,
          organization_name: '55A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '박정미',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01048154759',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 36,
          organization_name: '55A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '임영희',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01042677689',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 37,
          organization_name: '55B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '어경숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01084891417',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 38,
          organization_name: '55B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '이현주',
          name_suffix: 'D',
          region: 'Unknown',
          phone_number: '01054290703',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 39,
          organization_name: '55B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '조정례',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01081201538',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 40,
          organization_name: '56A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '이순덕',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01039478285',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 41,
          organization_name: '56A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '정을수',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01056872568',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 42,
          organization_name: '56A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '황현자',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01099893891',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 43,
          organization_name: '56B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '박채숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01053891300',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 44,
          organization_name: '56B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '김광희',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01023657925',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 45,
          organization_name: '56B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '김문자',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01039245630',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 46,
          organization_name: '57 여전도회',
          role: '회장',
          church_office: '권사',
          name: '김경자',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01053880497',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 47,
          organization_name: '57 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '김순례',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01097301311',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 48,
          organization_name: '57 여전도회',
          role: '총무',
          church_office: '권사',
          name: '안경옥',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01022418241',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 49,
          organization_name: '58 여전도회',
          role: '회장',
          church_office: '권사',
          name: '홍승미',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01067996049',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 50,
          organization_name: '58 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '노인옥',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01024502373',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 51,
          organization_name: '58 여전도회',
          role: '총무',
          church_office: '권사',
          name: '김동희',
          name_suffix: 'E',
          region: 'Unknown',
          phone_number: '01030432373',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 52,
          organization_name: '59A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '구회순',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01052549520',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 53,
          organization_name: '59A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '김희숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01091540133',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 54,
          organization_name: '59A 여전도회',
          role: '총무',
          church_office: '집사',
          name: '이형자',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01084659915',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 55,
          organization_name: '60A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '김동규',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01077542672',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 56,
          organization_name: '60A 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '오명희',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01041013467',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 57,
          organization_name: '60A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '이경자',
          name_suffix: 'E',
          region: 'Unknown',
          phone_number: '01084659915',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 58,
          organization_name: '60B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '정영숙',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01089944159',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 59,
          organization_name: '60B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '최진숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01095795782',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 60,
          organization_name: '60B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '양정희',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01039161235',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 61,
          organization_name: '61B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '이정희',
          name_suffix: 'C',
          region: 'Unknown',
          phone_number: '01037469737',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 62,
          organization_name: '61B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '주복자',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01048667170',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 63,
          organization_name: '61B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '김순태',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01065596828',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 64,
          organization_name: '62A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '채지희',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01023124126',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 65,
          organization_name: '62A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '한명선',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01097655359',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 66,
          organization_name: '62A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '한혜진',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01099100637',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 67,
          organization_name: '62B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '남길순',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01041596755',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 68,
          organization_name: '62B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '이예원',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01073589425',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 69,
          organization_name: '62B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '우태순',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01043161345',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 70,
          organization_name: '63B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '윤분순',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01020506953',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 71,
          organization_name: '63B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '김영화',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01030389577',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 72,
          organization_name: '63B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '심영희',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01042578291',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 73,
          organization_name: '64A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '이현옥',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01091333944',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 74,
          organization_name: '64A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '안신자',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01048569577',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 75,
          organization_name: '64A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '정효신',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01031294348',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 76,
          organization_name: '65A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '안경이',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01020062676',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 77,
          organization_name: '65A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '양동숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01055660859',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 78,
          organization_name: '65A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '정혜원',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01082304599',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 79,
          organization_name: '65B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '손정희',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01053762555',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 80,
          organization_name: '65B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '한미옥',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01072102418',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 81,
          organization_name: '65B 여전도회',
          role: '총무',
          church_office: '집사',
          name: '김민숙',
          name_suffix: 'D',
          region: 'Unknown',
          phone_number: '01088903268',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 82,
          organization_name: '66A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '서은주',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01089192397',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 83,
          organization_name: '66A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '김옥선',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01044834119',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 84,
          organization_name: '66A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '오영미',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01099669433',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 85,
          organization_name: '66B 여전도회',
          role: '회장',
          church_office: '집사',
          name: '김점숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01037542329',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 86,
          organization_name: '66B 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '윤은주',
          name_suffix: 'C',
          region: 'Unknown',
          phone_number: '01082172339',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 87,
          organization_name: '66B 여전도회',
          role: '총무',
          church_office: '집사',
          name: '조정숙',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01093824686',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 88,
          organization_name: '67A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '한채아',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01087629939',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 89,
          organization_name: '67A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '이윤경',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01056207975',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 90,
          organization_name: '67A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '김도향',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01032997249',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 91,
          organization_name: '67B 여전도회',
          role: '회장',
          church_office: '장로',
          name: '이안옥',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01025109026',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 92,
          organization_name: '67B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '정영신',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01022679537',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 93,
          organization_name: '67B 여전도회',
          role: '총무',
          church_office: '집사',
          name: '전희주',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01080283001',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 94,
          organization_name: '68B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '김은하',
          name_suffix: 'C',
          region: 'Unknown',
          phone_number: '01043791102',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 95,
          organization_name: '68B 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '신유나',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01047866341',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 96,
          organization_name: '68B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '김성지',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01055251772',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 97,
          organization_name: '69A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '민춘희',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01076008363',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 98,
          organization_name: '69A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '이성희',
          name_suffix: 'C',
          region: 'Unknown',
          phone_number: '01039266660',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 99,
          organization_name: '69A 여전도회',
          role: '총무',
          church_office: '집사',
          name: '김수경',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01096905020',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 100,
          organization_name: '69B 여전도회',
          role: '회장',
          church_office: '권사',
          name: '김옥자',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01090209922',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 101,
          organization_name: '69B 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '노미영',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01020318310',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 102,
          organization_name: '69B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '박해정',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01087930041',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 103,
          organization_name: '70A 여전도회',
          role: '회장',
          church_office: '권사',
          name: '김정란',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01062830108',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 104,
          organization_name: '70A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '홍미영',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01097673339',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 105,
          organization_name: '70A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '문예은',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01071610135',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 106,
          organization_name: '72 여전도회',
          role: '회장',
          church_office: '권사',
          name: '박지선',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01046934403',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 107,
          organization_name: '72 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '유영희',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01074245269',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 108,
          organization_name: '72 여전도회',
          role: '총무',
          church_office: '권사',
          name: '안순숙',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01030906875',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 109,
          organization_name: '73 여전도회',
          role: '회장',
          church_office: '권사',
          name: '이명주',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01023288996',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 110,
          organization_name: '73 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '정선애',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01066267353',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 111,
          organization_name: '73 여전도회',
          role: '총무',
          church_office: '집사',
          name: '김태향',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01036852294',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 112,
          organization_name: '74A 여전도회',
          role: '회장',
          church_office: '집사',
          name: '최유림',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01063058291',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 113,
          organization_name: '74A 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '윤경옥',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01042431003',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 114,
          organization_name: '74A 여전도회',
          role: '총무',
          church_office: '권사',
          name: '김시화',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01032305018',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 115,
          organization_name: '74B 여전도회',
          role: '회장',
          church_office: '집사',
          name: '이규희',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01025077572',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 116,
          organization_name: '74B 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '김희정',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01068274566',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 117,
          organization_name: '74B 여전도회',
          role: '총무',
          church_office: '권사',
          name: '장은영',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01095384402',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 118,
          organization_name: '76 여전도회',
          role: '회장',
          church_office: '집사',
          name: '신정은',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01076767840',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 119,
          organization_name: '76 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '장영은',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01091418458',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 120,
          organization_name: '76 여전도회',
          role: '총무',
          church_office: '집사',
          name: '채연선',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01090825980',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 121,
          organization_name: '78 여전도회',
          role: '회장',
          church_office: '집사',
          name: '하미란',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01042224262',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 122,
          organization_name: '78 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '이경희',
          name_suffix: 'I',
          region: 'Unknown',
          phone_number: '01085655626',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 123,
          organization_name: '78 여전도회',
          role: '총무',
          church_office: '집사',
          name: '전경화',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01092753442',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 124,
          organization_name: '81 여전도회',
          role: '회장',
          church_office: '집사',
          name: '정유진',
          name_suffix: 'D',
          region: 'Unknown',
          phone_number: '01050295897',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 125,
          organization_name: '81 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '김은미',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01034411317',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 126,
          organization_name: '81 여전도회',
          role: '총무',
          church_office: '집사',
          name: '김수라',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01053462575',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 127,
          organization_name: '82 여전도회',
          role: '회장',
          church_office: '집사',
          name: '한윤경',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01042514252',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 128,
          organization_name: '82 여전도회',
          role: '부회장',
          church_office: '권사',
          name: '이연주',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01042419325',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 129,
          organization_name: '82 여전도회',
          role: '총무',
          church_office: '집사',
          name: '김경미',
          name_suffix: 'H',
          region: 'Unknown',
          phone_number: '01023020315',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 130,
          organization_name: '86 여전도회',
          role: '회장',
          church_office: '집사',
          name: '박이슬',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01023541030',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 131,
          organization_name: '86 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '송은혜',
          name_suffix: 'B',
          region: 'Unknown',
          phone_number: '01022845627',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 132,
          organization_name: '86 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '고수진',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01034128708',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 133,
          organization_name: '86 여전도회',
          role: '총무',
          church_office: '집사',
          name: '윤지연',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01072006223',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 134,
          organization_name: '90 여전도회',
          role: '회장',
          church_office: '집사',
          name: '김다은',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01042264802',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 135,
          organization_name: '90 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '한승희',
          name_suffix: 'C',
          region: 'Unknown',
          phone_number: '01090491813',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 136,
          organization_name: '90 여전도회',
          role: '총무',
          church_office: '집사',
          name: '이지현',
          name_suffix: 'C',
          region: 'Unknown',
          phone_number: '01045417542',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 137,
          organization_name: '90 여전도회',
          role: '총무',
          church_office: '집사',
          name: '김사라',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01057570711',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 138,
          organization_name: '92 여전도회',
          role: '회장',
          church_office: '집사',
          name: '방선명',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01077652823',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 139,
          organization_name: '92 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '박미선',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01063579422',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 140,
          organization_name: '92 여전도회',
          role: '총무',
          church_office: '집사',
          name: '이현애',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01085576241',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 141,
          organization_name: '93 이하 여전도회',
          role: '회장',
          church_office: '집사',
          name: '신혜민',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01056201686',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 142,
          organization_name: '93 이하 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '지세령',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01063068678',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 143,
          organization_name: '93 이하 여전도회',
          role: '부회장',
          church_office: '집사',
          name: '방혜주',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01094102823',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
        {
          id: 144,
          organization_name: '42부터 44 여전도회',
          role: '총무',
          church_office: '집사',
          name: '천수인',
          name_suffix: 'A',
          region: 'Unknown',
          phone_number: '01094678509',
          is_kakaotalk_chat_member: 'Y',
          is_new_member: 'Y',
          is_long_term_absentee: 'N',
        },
      ],
    };
  },
  mixins: [CustomLoger, ArrayCtrl, StringCtrl, MasterCtrl, AWSS3Ctrl, Utility],
  methods: {
    //표준 주석생성
    async newUserDataUpdate() {
      try {
        console.log('데이터 업데이트 프로세스 시작...');

        // 1. 관련된 테이블의 정보를 받아온다.
        console.log('1. 관련 테이블 데이터 로드 중...');

        let organization_data = await this.openReadDataList(this.Organization);
        organization_data = organization_data.data;
        console.log('Organization 데이터 로드 완료');

        let role_data = await this.openReadDataList(this.Role);
        role_data = role_data.data;
        console.log('Role 데이터 로드 완료');

        let user_data = await this.openReadDataList(this.User);
        user_data = user_data.data;
        console.log('User 데이터 로드 완료');

        let user_has_role_data = await this.openReadDataList(this.UserHasRole);
        user_has_role_data = user_has_role_data.data;
        console.log('UserHasRole 데이터 로드 완료');

        // 2. newUserDataByExcel 데이터 처리 및 검증
        console.log('2. newUserDataByExcel 데이터 처리 및 검증 시작...');
        let processedData = [];
        let newUsersToCreate = [];
        let userHasRoleDataToCreate = [];

        for (let [index, userData] of this.newUserDataByExcel.entries()) {
          // 2.1. organization_name을 사용하여 organization_id를 찾는다.
          const org = organization_data.find(
            (org) =>
              org.organization_name.trim() === userData.organization_name.trim()
          );
          if (!org) {
            throw new Error(
              `데이터 ${index + 1}: '${
                userData.organization_name
              }' 조직을 찾을 수 없습니다.`
            );
          }
          userData.organization_id = org.id;
          userData.organization_code = org.organization_code;

          // 2.2. role을 사용하여 role_id를 찾는다.
          const role = role_data.find(
            (r) => r.role_name.trim() === userData.role.trim()
          );
          if (!role) {
            throw new Error(
              `데이터 ${index + 1}: '${userData.role}' 역할을 찾을 수 없습니다.`
            );
          }
          userData.role_id = role.id;

          // 2.3. 유저 데이터 검증
          if (!userData.name || !userData.phone_number) {
            throw new Error(
              `데이터 ${index + 1}: 이름 또는 전화번호가 누락되었습니다.`
            );
          }

          // 2.4. 기존 유저 확인
          const existingUser = user_data.find(
            (user) =>
              user.name === userData.name &&
              user.phone_number === userData.phone_number
          );

          if (existingUser) {
            userData.user_id = existingUser.id;
          } else {
            // 새 유저 생성 준비
            newUsersToCreate.push({
              name: userData.name,
              name_suffix: userData.name_suffix || '',
              email: userData.email || `${userData.name}@example.com`,
              password: userData.password || 'defaultpassword',
              gender_type: userData.gender_type || 'U',
              birth_date: userData.birth_date || '2000-01-01',
              address: userData.address || 'Default Address',
              address_detail: userData.address_detail || '',
              city: userData.city || 'Default City',
              state_province: userData.state_province || 'Default State',
              country: userData.country || 'Default Country',
              zip_postal_code: userData.zip_postal_code || '00000',
              is_address_public: userData.is_address_public || 'N',
              sns_url: userData.sns_url || '',
              hobby: userData.hobby || '',
              phone_number: userData.phone_number,
              is_phone_number_public: userData.is_phone_number_public || 'N',
              church_member_number: userData.church_member_number || '000000',
              church_registration_date:
                userData.church_registration_date ||
                new Date().toISOString().split('T')[0],
              is_new_member: userData.is_new_member,
              is_long_term_absentee: userData.is_long_term_absentee,
              is_kakaotalk_chat_member: userData.is_kakaotalk_chat_member,
              is_deleted: 'N',
              creator_id: 1,
              updater_id: 1,
              creator_ip: '127.0.0.1',
              updater_ip: '127.0.0.1',
              access_service_id: 'default_service',
            });
          }

          // 2.5. UserHasRole 데이터 준비
          userHasRoleDataToCreate.push({
            user_id: userData.user_id, // 기존 유저의 경우
            role_id: userData.role_id,
            organization_id: userData.organization_id,
            organization_code: userData.organization_code,
            role_start_date: new Date().toISOString().split('T')[0],
            role_end_date: null,
            is_deleted: 'N',
            creator_id: 1,
            updater_id: 1,
            creator_ip: '127.0.0.1',
            updater_ip: '127.0.0.1',
            access_service_id: 'default_service',
          });

          processedData.push(userData);
        }

        console.log('데이터 처리 및 검증 완료');

        // 3. 데이터베이스 업데이트
        console.log('3. 데이터베이스 업데이트 시작...');

        // 3.1. 새 유저 생성
        for (let newUser of newUsersToCreate) {
          const createdUser = await this.openCreateData(
            this.User,
            newUser,
            true
          );
          if (createdUser.result === 0) {
            throw new Error(`유저 생성 실패: ${newUser.name}`);
          }
          console.log(`유저 생성 완료: ID ${createdUser.id}`);

          // 생성된 유저의 ID를 UserHasRole 데이터에 추가
          const relatedUserHasRoleData = userHasRoleDataToCreate.find(
            (data) =>
              data.user_id === undefined &&
              data.phone_number === newUser.phone_number
          );
          if (relatedUserHasRoleData) {
            relatedUserHasRoleData.user_id = createdUser.id;
          }
        }

        // 3.2. UserHasRole 데이터 생성
        for (let data of userHasRoleDataToCreate) {
          const existingUserRole = user_has_role_data.find(
            (entry) =>
              entry.user_id === data.user_id &&
              entry.organization_id === data.organization_id &&
              entry.role_id === data.role_id
          );

          if (!existingUserRole) {
            const createdUserHasRole = await this.openCreateData(
              this.UserHasRole,
              data,
              true
            );
            if (createdUserHasRole.result === 0) {
              throw new Error(
                `UserHasRole 데이터 생성 실패: ${JSON.stringify(data)}`
              );
            }
            console.log(
              `UserHasRole 데이터 생성 성공: ID ${createdUserHasRole.id}`
            );
          } else {
            console.log(
              `UserHasRole 데이터 이미 존재: User ID ${data.user_id}, Organization ID ${data.organization_id}, Role ID ${data.role_id}`
            );
          }
        }

        console.log('데이터베이스 업데이트 완료');
        console.log('데이터 업데이트 프로세스 성공적으로 완료');
      } catch (error) {
        console.error('데이터 업데이트 중 오류 발생:', error.message);
        // 여기서 함수 실행을 중단합니다.
        return;
      }
    },

    // async newUserDataUpdate() {
    //   // 1. 관련된 테이블의 정보를 받아온다.

    //   // 1.1. Organization 테이블에서 모든 조직 정보를 받아온다.
    //   // openReadDataList 함수는 비동기 함수로, Organization 테이블의 데이터를 받아온다.
    //   // 받아온 데이터는 organization_data 변수에 저장된다.
    //   let organization_data = await this.openReadDataList(this.Organization);
    //   // organization_data에서 실제 데이터 배열을 추출하여 organization_data 변수에 다시 저장한다.
    //   organization_data = organization_data.data;
    //   // 받아온 조직 데이터를 콘솔에 출력하여 확인한다.
    //   console.log("organization_data", organization_data);

    //   // 1.2. Role 테이블에서 모든 직책 정보를 받아온다.
    //   // openReadDataList 함수는 비동기 함수로, Role 테이블의 데이터를 받아온다.
    //   // 받아온 데이터는 role_data 변수에 저장된다.
    //   let role_data = await this.openReadDataList(this.Role);
    //   // role_data에서 실제 데이터 배열을 추출하여 role_data 변수에 다시 저장한다.
    //   role_data = role_data.data;
    //   // 받아온 직책 데이터를 콘솔에 출력하여 확인한다.
    //   console.log("role_data", role_data);

    //   // 1.3. User 테이블에서 모든 유저 정보를 받아온다.
    //   let user_data = await this.openReadDataList(this.User);
    //   user_data = user_data.data;
    //   console.log("user_data", user_data);

    //   // 1.4. UserHasRole 테이블에서 모든 유저-롤 정보를 받아온다.
    //   let user_has_role_data = await this.openReadDataList(this.UserHasRole);
    //   user_has_role_data = user_has_role_data.data;
    //   console.log("user_has_role_data", user_has_role_data);

    //   // 2. newUserDataByExcel 데이터를 순회하면서 organization_id와 role_id를 추가한다.
    //   // newUserDataByExcel 배열을 순회하며 각 userData에 대해 처리한다.
    //   for (let userData of this.newUserDataByExcel) {
    //     // 2.1. organization_name을 사용하여 organization_id를 찾는다.
    //     // organization_data 배열에서 userData.organization_name과 일치하는 조직을 찾는다.
    //     const org = organization_data.find(
    //       (org) =>
    //         org.organization_name.trim() === userData.organization_name.trim()
    //     );
    //     // 일치하는 조직이 있으면 organization_id를 userData에 추가한다.
    //     if (org) {
    //       userData.organization_id = org.id;
    //       userData.organization_code = org.organization_code;
    //     } else {
    //       // 일치하는 조직이 없으면 경고 메시지를 콘솔에 출력하고 organization_id를 null로 설정한다.
    //       console.warn(
    //         `Organization not found for name: ${userData.organization_name}`
    //       );
    //       userData.organization_id = null; // 필요에 따라 누락된 경우를 처리
    //     }

    //     // 2.2. role을 사용하여 role_id를 찾는다.
    //     // role_data 배열에서 userData.role과 일치하는 직책을 찾는다.
    //     const role = role_data.find(
    //       (r) => r.role_name.trim() === userData.role.trim()
    //     );
    //     // 일치하는 직책이 있으면 role_id를 userData에 추가한다.
    //     if (role) {
    //       userData.role_id = role.id;
    //     } else {
    //       // 일치하는 직책이 없으면 경고 메시지를 콘솔에 출력하고 role_id를 null로 설정한다.
    //       console.warn(`Role not found for name: ${userData.role}`);
    //       userData.role_id = null; // 필요에 따라 누락된 경우를 처리
    //     }
    //   }

    //   // 2.3. 데이터가 정확히 업데이트되었는지 확인하는 콘솔로그 출력
    //   // 업데이트된 newUserDataByExcel 배열을 콘솔에 출력하여 확인한다.
    //   console.log("Updated newUserDataByExcel", this.newUserDataByExcel);

    //   // 3. 유저 데이터 생성 또는 기존 유저 확인
    //   for (let userData of this.newUserDataByExcel) {
    //     // 3.1. 동일한 이름과 전화번호를 가진 유저가 이미 존재하는지 확인
    //     const existingUser = user_data.find(
    //       (user) =>
    //         user.name === userData.name &&
    //         user.phone_number === userData.phone_number
    //     );
    //     if (existingUser) {
    //       console.log(
    //         `User already exists: ${userData.name} (${userData.phone_number})`
    //       );
    //       // user_id를 기존 유저의 id로 설정
    //       userData.user_id = existingUser.id;
    //     } else {
    //       console.log("새로운 유저 생성");
    //       // 3.2. 유저 생성
    //       const newUser = {
    //         name: userData.name,
    //         name_suffix: userData.name_suffix || "", // 선택적 필드
    //         email: userData.email || "default@example.com", // 필수 필드 - 적절한 임의의 이메일로 대체
    //         password: userData.password || "defaultpassword", // 필수 필드 - 적절한 임의의 비밀번호로 대체
    //         gender_type: userData.gender_type || "U", // 선택적 필드 - U로 설정 (Unknown)
    //         birth_date: userData.birth_date || "2000-01-01", // 선택적 필드 - 임의의 날짜
    //         address: userData.address || "Default Address Line 1", // 선택적 필드
    //         address_detail: userData.address_detail || "Default Address Line 2", // 선택적 필드
    //         city: userData.city || "Default City", // 선택적 필드
    //         state_province: userData.state_province || "Default State", // 선택적 필드
    //         country: userData.country || "Default Country", // 선택적 필드
    //         zip_postal_code: userData.zip_postal_code || "00000", // 선택적 필드
    //         is_address_public: userData.is_address_public || "N", // 필수 필드
    //         sns_url: userData.sns_url || "", // 선택적 필드
    //         hobby: userData.hobby || "None", // 선택적 필드
    //         phone_number: userData.phone_number, // 필수 필드
    //         is_phone_number_public: userData.is_phone_number_public || "N", // 필수 필드
    //         church_member_number: userData.church_member_number || "000000", // 선택적 필드
    //         church_registration_date:
    //           userData.church_registration_date || "2023-01-01", // 선택적 필드
    //         is_new_member: userData.is_new_member, // 필수 필드
    //         is_long_term_absentee: userData.is_long_term_absentee, // 필수 필드
    //         is_kakaotalk_chat_member: userData.is_kakaotalk_chat_member, // 필수 필드
    //         is_deleted: userData.is_deleted || "N", // 필수 필드
    //         // created_at: userData.created_at || new Date().toISOString(), // 필수 필드
    //         // updated_at: userData.updated_at || new Date().toISOString(), // 필수 필드
    //         creator_id: userData.creator_id || 1, // 필수 필드 - 임의의 생성자 ID로 대체
    //         updater_id: userData.updater_id || 1, // 필수 필드 - 임의의 수정자 ID로 대체
    //         creator_ip: userData.creator_ip || "127.0.0.1", // 필수 필드 - 임의의 IP 주소로 대체
    //         updater_ip: userData.updater_ip || "127.0.0.1", // 필수 필드 - 임의의 IP 주소로 대체
    //         access_service_id: userData.access_service_id || "default_service", // 선택적 필드
    //       };

    //       const createdUser = await this.openCreateData(
    //         this.User,
    //         newUser,
    //         true
    //       );
    //       if (createdUser.result === 0) {
    //         console.error(
    //           `Failed to create user: ${userData.name} (${userData.phone_number})`
    //         );
    //         userData.user_id = null; // 또는 오류를 처리하는 다른 방법을 사용
    //       } else {
    //         console.log(`Created user: ${createdUser.id}`);
    //         userData.user_id = createdUser.id;
    //       }
    //     }

    //     // 4. user_id와 organization_id, role_id를 가지고 user_has_role 테이블에 데이터를 생성한다.
    //     if (userData.user_id && userData.organization_id && userData.role_id) {
    //       // 4.1. 이미 해당 유저가 조직에서 역할을 가지고 있는지 확인
    //       const existingUserRole = user_has_role_data.find(
    //         (entry) =>
    //           entry.user_id === userData.user_id &&
    //           entry.organization_id === userData.organization_id &&
    //           entry.role_id === userData.role_id
    //       );

    //       if (!existingUserRole) {
    //         const userHasRoleData = {
    //           user_id: userData.user_id,
    //           role_id: userData.role_id,
    //           organization_id: userData.organization_id,
    //           organization_code: userData.organization_code || "default_code", // 선택적 필드 - 임의의 조직 코드
    //           role_start_date:
    //             userData.role_start_date ||
    //             new Date().toISOString().split("T")[0], // 선택적 필드 - 오늘 날짜
    //           role_end_date: userData.role_end_date || null, // 선택적 필드
    //           is_deleted: "N", // 필수 필드
    //           // created_at: new Date().toISOString(), // 필수 필드
    //           // updated_at: new Date().toISOString(), // 필수 필드
    //           creator_id: userData.creator_id || 1, // 필수 필드 - 임의의 생성자 ID로 대체
    //           updater_id: userData.updater_id || 1, // 필수 필드 - 임의의 수정자 ID로 대체
    //           creator_ip: userData.creator_ip || "127.0.0.1", // 필수 필드 - 임의의 IP 주소로 대체
    //           updater_ip: userData.updater_ip || "127.0.0.1", // 필수 필드 - 임의의 IP 주소로 대체
    //           access_service_id:
    //             userData.access_service_id || "default_service", // 선택적 필드
    //         };

    //         const createdUserHasRole = await this.openCreateData(
    //           this.UserHasRole,
    //           userHasRoleData,
    //           true
    //         );
    //         if (createdUserHasRole.result === 0) {
    //           console.error(
    //             `Failed to create user_has_role for user: ${userData.user_id}`
    //           );
    //         } else {
    //           console.log(
    //             `Created user_has_role entry: ${createdUserHasRole.id}`
    //           );
    //         }
    //       } else {
    //         console.log(
    //           `User ${userData.user_id} already has role ${userData.role_id} in organization ${userData.organization_id}`
    //         );
    //       }
    //     }
    //   }
    //   // 5. 데이터가 정확히 업데이트되었는지 확인하는 콘솔로그 출력
    //   console.log(
    //     "Updated newUserDataByExcel with user_id and user_has_role entries",
    //     this.newUserDataByExcel
    //   );
    // },
    async createUserHasRoleData() {
      try {
        // 1. 필요한 데이터 로드
        console.log('데이터 로드 시작...');

        // 1.1 Organization 데이터 로드
        let organization_data = await this.openReadDataList(this.Organization);
        organization_data = organization_data.data;
        console.log('조직 데이터 로드 완료');

        // 1.2 Role 데이터 로드
        let role_data = await this.openReadDataList(this.Role);
        role_data = role_data.data;
        console.log('역할 데이터 로드 완료');

        // 1.3 User 데이터 로드
        let user_data = await this.openReadDataList(this.User);
        user_data = user_data.data;
        console.log('유저 데이터 로드 완료');

        // 2. UserHasRole 데이터 준비
        console.log('UserHasRole 데이터 준비 시작...');
        let userHasRoleDataToCreate = [];

        for (let userData of this.newUserDataByExcel) {
          // 2.1 조직 ID 찾기
          const org = organization_data.find(
            (org) =>
              org.organization_name.trim() === userData.organization_name.trim()
          );
          if (!org) {
            console.error(
              `오류: '${userData.organization_name}' 조직을 찾을 수 없습니다.`
            );
            return; // 함수 종료
          }

          // 2.2 역할 ID 찾기
          const role = role_data.find(
            (r) => r.role_name.trim() === userData.role.trim()
          );
          if (!role) {
            console.error(`오류: '${userData.role}' 역할을 찾을 수 없습니다.`);
            return; // 함수 종료
          }

          // 2.3 유저 찾기
          const user = user_data.find(
            (u) =>
              u.name === userData.name &&
              u.phone_number === userData.phone_number
          );
          if (!user) {
            console.error(
              `오류: '${userData.name}' (${userData.phone_number}) 유저를 찾을 수 없습니다.`
            );
            return; // 함수 종료
          }

          // 2.4 UserHasRole 데이터 객체 생성
          const userHasRoleData = {
            user_id: user.id,
            role_id: role.id,
            organization_id: org.id,
            organization_code: org.organization_code,
            role_start_date: new Date().toISOString().split('T')[0], // 오늘 날짜
            role_end_date: null,
            is_deleted: 'N',
            creator_id: 1, // 적절한 creator_id 설정
            updater_id: 1, // 적절한 updater_id 설정
            creator_ip: '127.0.0.1', // 적절한 IP 주소
            updater_ip: '127.0.0.1', // 적절한 IP 주소
            access_service_id: 'default_service',
          };

          userHasRoleDataToCreate.push(userHasRoleData);
        }

        console.log('UserHasRole 데이터 준비 완료');

        // 3. 데이터베이스에 UserHasRole 데이터 생성
        console.log('데이터베이스에 UserHasRole 데이터 생성 시작...');
        for (let data of userHasRoleDataToCreate) {
          const result = await this.openCreateData(
            this.UserHasRole,
            data,
            true
          );
          if (result.result === 0) {
            console.error(
              `UserHasRole 데이터 생성 실패: ${JSON.stringify(data)}`
            );
          } else {
            console.log(`UserHasRole 데이터 생성 성공: ID ${result.id}`);
          }
        }

        console.log('모든 UserHasRole 데이터 생성 완료');
      } catch (error) {
        console.error('함수 실행 중 오류 발생:', error);
      }
    },
  },
};
