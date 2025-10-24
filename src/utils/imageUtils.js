/**
 * 이미지 처리 유틸리티 함수 모음
 * @description 이미지 업로드, 압축, 파일 변환 등을 처리하는 공통 함수들
 */

/**
 * 이미지 파일을 압축하는 함수
 * @param {File} file - 원본 이미지 파일
 * @param {number} maxSizeMB - 목표 파일 크기 (MB)
 * @param {number} maxWidth - 최대 너비 (픽셀)
 * @param {number} maxHeight - 최대 높이 (픽셀)
 * @returns {Promise<Blob>} 압축된 이미지 Blob
 * @description
 * 이미지를 주어진 크기 제한에 맞게 압축합니다.
 * 1. 이미지 크기를 maxWidth/maxHeight에 맞게 리사이즈
 * 2. JPEG 품질을 조정하여 파일 크기를 maxSizeMB 이하로 압축
 */
export async function compressImage(
  file,
  maxSizeMB = 3,
  maxWidth = 1280,
  maxHeight = 720
) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 초기 품질 설정
        let quality = 0.7;
        const maxSize = maxSizeMB * 1024 * 1024; // MB를 bytes로 변환

        // 이미지 크기 조정
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; // 배경을 흰색으로 설정
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        /**
         * 재귀적으로 품질을 조정하며 압축하는 내부 함수
         * @param {number} currentQuality - 현재 JPEG 품질
         */
        const compressAndCheck = (currentQuality) => {
          const dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          const binaryData = atob(dataUrl.split(',')[1]);
          const currentSize = binaryData.length;

          if (currentSize > maxSize && currentQuality > 0.1) {
            // 품질을 낮춰서 다시 시도
            const newQuality =
              currentQuality > 0.5
                ? currentQuality - 0.2
                : currentQuality - 0.1;
            compressAndCheck(Math.max(0.1, newQuality));
          } else {
            // Blob 생성
            const byteArray = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
              byteArray[i] = binaryData.charCodeAt(i);
            }
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            resolve(blob);
          }
        };

        compressAndCheck(quality);
      };

      img.onerror = (error) => {
        reject(error);
      };
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
}

/**
 * 이미지 파일 크기 검증
 * @param {File|Array<File>} value - 파일 또는 파일 배열
 * @param {number} maxSizeMB - 최대 파일 크기 (MB)
 * @returns {boolean|string} 유효하면 true, 아니면 오류 메시지
 */
export function validateImageSize(value, maxSizeMB = 3) {
  if (!value) return true;
  const file = Array.isArray(value) ? value[0] : value;
  const size = file.size / 1024 / 1024; // MB 단위로 변환
  return (
    size <= maxSizeMB || `파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`
  );
}

/**
 * 단일 파일만 허용하는지 검증
 * @param {File|Array<File>} value - 파일 또는 파일 배열
 * @returns {boolean|string} 유효하면 true, 아니면 오류 메시지
 */
export function validateSingleFile(value) {
  if (Array.isArray(value) && value.length > 1) {
    return '하나의 이미지만 업로드 가능합니다.';
  }
  return true;
}

/**
 * 이미지 파일 처리 (크기 초과 시 자동 압축)
 * @param {File} file - 이미지 파일
 * @param {number} maxSizeMB - 최대 파일 크기 (MB)
 * @returns {Promise<{file: File, url: string, compressed: boolean, compressionRate?: number}>}
 * @description
 * 이미지 파일을 처리하고 필요시 압축합니다.
 * - 파일 크기가 maxSizeMB 이하면 원본 사용
 * - 초과하면 자동으로 압축
 * - 미리보기 URL과 함께 반환
 */
export async function processImageFile(file, maxSizeMB = 3) {
  const originalSize = file.size / 1024 / 1024; // MB

  if (originalSize <= maxSizeMB) {
    // 크기가 적절하면 원본 사용
    return {
      file: file,
      url: URL.createObjectURL(file),
      compressed: false,
    };
  }

  // 크기 초과 시 압축
  console.log(`원본 이미지 크기: ${originalSize.toFixed(2)}MB`);

  const compressedBlob = await compressImage(file, maxSizeMB);
  const compressedSize = compressedBlob.size / 1024 / 1024;

  console.log(`압축된 이미지 크기: ${compressedSize.toFixed(2)}MB`);

  // Blob을 File 객체로 변환
  const compressedFile = new File([compressedBlob], file.name, {
    type: 'image/jpeg',
    lastModified: new Date().getTime(),
  });

  const compressionRate =
    ((originalSize - compressedSize) / originalSize) * 100;

  console.log(`이미지 압축률: ${compressionRate.toFixed(1)}%`);

  // 압축 후에도 크기 초과 시 에러
  if (compressedSize > maxSizeMB) {
    throw new Error(
      `이미지 압축 후에도 ${maxSizeMB}MB를 초과합니다. 더 작은 이미지를 선택해주세요.`
    );
  }

  return {
    file: compressedFile,
    url: URL.createObjectURL(compressedFile),
    compressed: true,
    compressionRate: compressionRate.toFixed(1),
  };
}

/**
 * S3 업로드용 파일명 생성
 * @param {Object} params - 파일명 생성 파라미터
 * @param {number} params.organizationId - 조직 ID
 * @param {number} params.activityId - 활동 ID
 * @param {string} params.activityName - 활동 이름
 * @param {string} params.fileExtension - 파일 확장자
 * @param {string} params.prefix - 파일 경로 접두사 (기본: 'meetings/')
 * @returns {{fileName: string, filePath: string}} 파일명과 전체 경로
 * @description
 * S3에 업로드할 파일의 이름을 규칙에 따라 생성합니다.
 * 형식: org_{orgId}_activity_{activityId}_{activityName}_instance_{timestamp}.{ext}
 */
export function generateS3FileName({
  organizationId,
  activityId,
  activityName,
  fileExtension,
  prefix = 'meetings/',
}) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];

  const fileName = `org_${organizationId}_activity_${activityId}_${activityName}_instance_${timestamp}.${fileExtension}`;
  const filePath = `${prefix}${fileName}`;

  return { fileName, filePath };
}

/**
 * 파일 확장자 추출
 * @param {string} fileName - 파일명
 * @returns {string} 파일 확장자 (예: 'jpg', 'png')
 */
export function getFileExtension(fileName) {
  return fileName.split('.').pop().toLowerCase();
}

/**
 * 이미지 파일 여부 확인
 * @param {File} file - 파일 객체
 * @returns {boolean} 이미지 파일이면 true
 */
export function isImageFile(file) {
  if (!file || !file.type) return false;
  return file.type.startsWith('image/');
}
