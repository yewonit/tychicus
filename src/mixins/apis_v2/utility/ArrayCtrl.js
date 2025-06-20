export const ArrayCtrl = {
  data() {
    return {};
  },
  methods: {
    // 오브젝트 배열에 특정 키값을 추출하여 ,로 구분된 문자열로 반환하는 함수
    getObjectArrayToString(objArray, key) {
      let str = '';
      for (let i = 0; i < objArray.length; i++) {
        if (i === 0) {
          str += objArray[i][key];
        } else {
          str += ',' + objArray[i][key];
        }
      }
      return str;
    },
    // 오브젝트 배열에 특정 키값을 추출하여 배열로 반환하는 함수
    getObjectArrayToArray(objArray, key) {
      let arr = [];
      for (let i = 0; i < objArray.length; i++) {
        arr.push(objArray[i][key]);
      }
      return arr;
    },
    // 오브젝트에서 특정 키의 값을 비교하여 배열의 인덱스를 반환하는 함수
    getObjectArrayIndex(objArray, key, value) {
      for (let i = 0; i < objArray.length; i++) {
        if (objArray[i][key] === value) {
          return i;
        }
      }
      return -1;
    },

    // 배열을 ,로 구분하여 문자열로 반환하는 함수
    getArrayToString(array) {
      let str = '';
      for (let i = 0; i < array.length; i++) {
        str += array[i];
        if (i < array.length - 1) {
          str += ',';
        }
      }
      return str;
    },
    // 문자열을 ,로 구분하여 배열로 반환하는 함수
    getStringToArray(str) {
      let array = str.split(',');
      return array;
    },

    // A배열과 B배열을 비교하여 같은 요소를 제거하는 함수
    removeSameArray(A, B) {
      let result = [];
      for (let i = 0; i < A.length; i++) {
        let isSame = false;
        for (let j = 0; j < B.length; j++) {
          if (A[i] === B[j]) {
            isSame = true;
            break;
          }
        }
        if (!isSame) {
          result.push(A[i]);
        }
      }
      return result;
    },
    // A배열과 B배열을 비교하여 중복되는 요소를 반환하는 함수
    getDuplicateElement(arrayA, arrayB) {
      let duplicateArray = [];
      for (let i = 0; i < arrayA.length; i++) {
        for (let j = 0; j < arrayB.length; j++) {
          if (arrayA[i] === arrayB[j]) {
            duplicateArray.push(arrayA[i]);
          }
        }
      }
      return duplicateArray;
    },

    // 새로운 배열에 추가된 요소들을 배열로 반환하는 함수
    async getAddedElements(oldArray, newArray) {
      const duplicateElement = await this.getDuplicateElement(
        oldArray,
        newArray
      );

      const addedElements = await this.removeSameArray(
        newArray,
        duplicateElement
      );
      return addedElements;
    },
    // 기존의 배열에서 삭제된 요소들을 배열로 반환하는 함수
    async getRemovedElements(oldArray, newArray) {
      const duplicateElement = await this.getDuplicateElement(
        oldArray,
        newArray
      );
      const removedElements = await this.removeSameArray(
        oldArray,
        duplicateElement
      );
      return removedElements;
    },
  },
};
