import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        success: '#66bb6a', // 성공 그린
        warning: '#ffa726', // 주황색
        error: '#ef5350', // 부드러운 빨강

        // === 2026년 벚꽃 테마 ===
        // 메인 색상 - 벚꽃 기반
        // primary: '#ff6b9d', // 벚꽃 핑크 (메인)
        // secondary: '#ffa8cc', // 연한 벚꽃 핑크
        // accent: '#ffe0eb', // 매우 연한 핑크

        // // 시스템 색상
        // info: '#87ceeb', // 하늘색 (봄 하늘)
        // success: '#98d982', // 연두색 (새싹)
        // warning: '#ffb347', // 복숭아색
        // error: '#ff6b6b', // 부드러운 빨강

        // // 그라데이션 설정 (벚꽃 그라데이션)
        // gradientStart: '#ff6b9d', // 진한 벚꽃
        // gradientMiddle: '#ff8fb3', // 중간 벚꽃
        // gradientEnd: '#ffb3cc', // 연한 벚꽃

        // // 호버 그라데이션 (더 진한 벚꽃)
        // hoverGradientStart: '#e6498a',
        // hoverGradientMiddle: '#ff6b9d',
        // hoverGradientEnd: '#ff8fb3',

        // // 그림자 색상 (벚꽃 핑크 투명도별)
        // shadowLight: 'rgba(255, 107, 157, 0.1)',
        // shadowMedium: 'rgba(255, 107, 157, 0.3)',
        // shadowStrong: 'rgba(255, 107, 157, 0.4)',

        // // 비활성화 색상 (따뜻한 그레이)
        // disabledStart: '#e8e8e8',
        // disabledMiddle: '#f0f0f0',
        // disabledEnd: '#f8f8f8',
        // disabledText: '#999',

        // // 배경 색상 (따뜻한 화이트)
        // backgroundPrimary: '#fefefe',
        // backgroundSecondary: '#fdf9fb',

        // === 2025년 민트-하늘 테마 ===
        // 메인 색상 - 민트와 하늘색 조화
        primary: '#4ecdc4', // 민트 그린
        secondary: '#5dade2', // 스카이 블루
        accent: '#a8e6cf', // 연한 민트

        // 시스템 색상
        info: '#85c1e9', // 밝은 하늘색

        // 그라데이션 설정 (파스텔 블루에서 민트색으로)
        gradientStart: '#a8d8ea', // 연한 파스텔 블루 시작
        gradientMiddle: '#89cff0', // 파스텔 블루-민트 중간
        gradientEnd: '#7fdecd', // 연한 민트 끝

        // 호버 그라데이션 (조금 더 진한 색상)
        hoverGradientStart: '#7fc7d9',
        hoverGradientMiddle: '#66c2c7',
        hoverGradientEnd: '#5fb3b3',

        // 그림자 색상 (파스텔 블루-민트 혼합)
        shadowLight: 'rgba(168, 216, 234, 0.2)',
        shadowMedium: 'rgba(137, 207, 240, 0.3)',
        shadowStrong: 'rgba(127, 222, 205, 0.4)',

        // 비활성화 색상
        disabledStart: '#d5dbdb',
        disabledMiddle: '#e8f4f8',
        disabledEnd: '#f4f6f7',
        disabledText: '#85929e',

        // 배경 색상 (시원한 느낌)
        backgroundPrimary: '#fdfefe',
        backgroundSecondary: '#f8fdff',

        // === 2027년 초록 테마 (추가) ===
        // 메인 색상 - 자연 초록 기반
        // primary: '#4caf50', // 메인 그린
        // secondary: '#81c784', // 연한 그린
        // accent: '#c8e6c9', // 매우 연한 그린

        // // 시스템 색상 (자연 테마)
        // info: '#42a5f5', // 하늘 블루

        // // 그라데이션 설정 (초록 그라데이션)
        // gradientStart: '#4caf50', // 메인 그린
        // gradientMiddle: '#66bb6a', // 중간 그린
        // gradientEnd: '#81c784', // 연한 그린

        // // 호버 그라데이션 (더 진한 초록)
        // hoverGradientStart: '#388e3c',
        // hoverGradientMiddle: '#4caf50',
        // hoverGradientEnd: '#66bb6a',

        // // 그림자 색상 (초록 투명도별)
        // shadowLight: 'rgba(76, 175, 80, 0.15)',
        // shadowMedium: 'rgba(76, 175, 80, 0.3)',
        // shadowStrong: 'rgba(76, 175, 80, 0.4)',

        // // 비활성화 색상 (자연스러운 그레이)
        // disabledStart: '#e8f5e8',
        // disabledMiddle: '#f1f8e9',
        // disabledEnd: '#f9fbe7',
        // disabledText: '#81c784',

        // // 배경 색상 (자연스러운 화이트)
        // backgroundPrimary: '#fafafa',
        // backgroundSecondary: '#f5f5f5',
      },
    },
  },
});
