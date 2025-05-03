export const CustomLoger = {
  data() {
    return {};
  },
  methods: {
    // 커스텀 로그
    // Level 1 : Component,View,Layout,App 등 UI 구현 계층에서 사용하는 로그
    lv1_Func(locationName, funcName, actionTitle) {
      if (actionTitle) {
        console.log(
          `


          %c[ ${locationName} ] ${funcName} > ${actionTitle}`,
          `color:#F8C471;`
        );
      } else {
        console.log(
          `
%c[ ${locationName} ] ${funcName}`,
          `color:#F8C471;`
        );
      }
    },
    lv1_Act(actionTitle) {
      console.log(
        `
%c[ Action ] ${actionTitle}`,
        `color:#ABEBC6;`
      );
    },
    lv1_Case(actionTitle) {
      console.log(`%c[ Case ] ${actionTitle}`, `color:#82E0AA;`);
    },
    lv1_SubAct(actionTitle) {
      console.log(`%c[ Sub Action ] ${actionTitle}`, `color:#82E0AA;`);
    },
    lv1_Data(dataName, data) {
      console.log(`%c[ Data ] ${dataName}`, `color:#E3DAC9;`, data);
    },
    // Level 2 : Mixin 1계층에서 사용하는 로그
    lv2_Func(locationName, funcName, actionTitle) {
      if (actionTitle) {
        console.log(
          `
          %c[ ${locationName} ] ${funcName} > ${actionTitle}`,
          `color:#6495ED;`
        );
      } else {
        console.log(
          `
%c[ ${locationName} ] ${funcName}`,
          `color:#6495ED;`
        );
      }
    },
    lv2_Act(actionTitle) {
      console.log(`%c[ Action ] ${actionTitle}`, `color:#6495ED;`);
    },
    lv2_Case(actionTitle) {
      console.log(`%c[ Case ] ${actionTitle}`, `color:#6495ED;`);
    },
    lv2_SubAct(actionTitle) {
      console.log(`%c[ Sub Action ] ${actionTitle}`, `color:#6495ED;`);
    },
    lv2_Data(dataName, data) {
      console.log(`%c[ Data ] ${dataName}`, `color:#6495ED;`, data);
    },
    // Level 3 : Mixin 2계층에서 사용하는 로그
    lv3_Func(locationName, funcName, actionTitle) {
      if (actionTitle) {
        console.log(
          `
          %c[ ${locationName} ] ${funcName} > ${actionTitle}`,
          `color:#008080;`
        );
      } else {
        console.log(
          `
%c[ ${locationName} ] ${funcName}`,
          `color:#008080;`
        );
      }
    },
    lv3_Act(actionTitle) {
      console.log(`%c[ Action ] ${actionTitle}`, `color:#008080;`);
    },
    lv3_Case(actionTitle) {
      console.log(`%c[ Case ] ${actionTitle}`, `color:#008080;`);
    },
    lv3_SubAct(actionTitle) {
      console.log(`%c[ Sub Action ] ${actionTitle}`, `color:#008080;`);
    },
    lv3_Data(dataName, data) {
      console.log(`%c[ Data ] ${dataName}`, `color:#008080;`, data);
    },
    // Level 4 : Mixin 3계층에서 사용하는 로그
    lv4_Func(locationName, funcName, actionTitle) {
      if (actionTitle) {
        console.log(
          `
          %c[ ${locationName} ] ${funcName} > ${actionTitle}`,
          `color:#505050;`
        );
      } else {
        console.log(
          `
%c[ ${locationName} ] ${funcName}`,
          `color:#505050;`
        );
      }
    },
    lv4_Act(actionTitle) {
      console.log(`%c[ Action ] ${actionTitle}`, `color:#505050;`);
    },
    lv4_Case(actionTitle) {
      console.log(`%c[ Case ] ${actionTitle}`, `color:#505050;`);
    },
    lv4_SubAct(actionTitle) {
      console.log(`%c[ Sub Action ] ${actionTitle}`, `color:#505050;`);
    },
    lv4_Data(dataName, data) {
      console.log(`%c[ Data ] ${dataName}`, `color:#505050;`, data);
    },
    // Error 로그
    errorLog(locationName, funcName, errorExplain, errorMessage) {
      console.log(
        `
          %c[ ${locationName} ] ${funcName} > ${errorExplain}`,
        `color:red;`,
        errorMessage
      );
    },
  },
};
