<template>
  <div class="aws-image-crud-test">
    <h2>AWS S3 이미지 CRUD 테스트</h2>

    <!-- 이미지 업로드 -->
    <div>
      <h3>이미지 업로드</h3>
      <input type="file" @change="handleFileUpload" accept="image/*" />
      <button @click="uploadImage">업로드</button>
    </div>

    <!-- 이미지 목록 -->
    <div>
      <h3>이미지 목록</h3>
      <button @click="listImages">목록 새로고침</button>
      <ul>
        <li v-for="image in images" :key="image.Key">
          {{ image.Key }}
          <button @click="viewImage(image.Key)">보기</button>
          <button @click="deleteImage(image.Key)">삭제</button>
        </li>
      </ul>
    </div>

    <!-- 선택된 이미지 표시 -->
    <div v-if="selectedImage">
      <h3>선택된 이미지</h3>
      <img :src="selectedImage" alt="Selected Image" style="max-width: 300px" />
    </div>
  </div>
</template>

<script>
  import { AWSS3Ctrl } from '@/mixins/apis_v2/external/AWSS3Ctrl.js';

  export default {
    name: 'AWSImageCRUDTest',
    mixins: [AWSS3Ctrl],
    data() {
      return {
        selectedFile: null,
        images: [],
        selectedImage: null,
      };
    },
    methods: {
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },
      async uploadImage() {
        if (!this.selectedFile) {
          alert('파일을 선택해주세요.');
          return;
        }
        const fileName = `meetings/${Date.now()}_${this.selectedFile.name}`;
        const result = await this.s3CreateFile(
          fileName,
          this.selectedFile,
          true
        );
        if (result) {
          alert('이미지 업로드 성공');
          this.listImages();
        }
      },
      async listImages() {
        this.images = await this.s3ReadFileList();
        this.images = this.images.filter((img) =>
          img.Key.startsWith('meetings/')
        );
      },
      async viewImage(key) {
        const imageData = await this.s3GetFile(key, true);
        if (imageData) {
          const blob = new Blob([imageData], { type: 'image/jpeg' });
          this.selectedImage = URL.createObjectURL(blob);
        }
      },
      async deleteImage(key) {
        const result = await this.s3DeleteFile(key, true);
        if (result) {
          alert('이미지 삭제 성공');
          this.listImages();
          if (this.selectedImage && this.selectedImage.includes(key)) {
            this.selectedImage = null;
          }
        }
      },
    },
    mounted() {
      this.listImages();
    },
  };
</script>

<style scoped>
  .aws-image-crud-test {
    padding: 20px;
  }
</style>
