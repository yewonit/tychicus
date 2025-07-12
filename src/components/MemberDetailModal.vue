<template>
  <div v-if="member" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ member.name }} 순원 정보</h3>
        <button @click="closeModal" class="close-button">×</button>
      </div>

      <div class="modal-body">
        <div class="member-detail-info">
          <div class="detail-section">
            <div class="detail-row">
              <div class="detail-item">
                <label class="detail-label">최근 출석일</label>
                <div class="detail-value">{{ member.lastAttendance }}</div>
              </div>
              <div class="detail-item">
                <label class="detail-label">연속 결석</label>
                <div class="detail-value">
                  {{ member.consecutiveAbsences }}주
                </div>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-item">
                <label class="detail-label">출석 횟수</label>
                <div class="detail-value">{{ member.attendanceCount }}</div>
              </div>
              <div class="detail-item">
                <label class="detail-label">연락처</label>
                <div class="detail-value">{{ member.phone }}</div>
              </div>
            </div>
          </div>

          <div class="memo-section">
            <label class="detail-label">메모</label>
            <div class="memo-content">
              최근 건강 문제로 교회 참석이 어려운 상황입니다. 지난 심방 시 기도
              요청이 있었습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MemberDetailModal',
    props: {
      member: {
        type: Object,
        default: null,
      },
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
    },
  };
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 0;
    margin-bottom: 20px;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    color: #374151;
  }

  .modal-body {
    padding: 0 24px 24px;
  }

  .member-detail-info {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-label {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
  }

  .detail-value {
    font-size: 16px;
    color: #1f2937;
    font-weight: 500;
  }

  .memo-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }

  .memo-content {
    font-size: 14px;
    line-height: 1.5;
    color: #6b7280;
    background: #f9fafb;
    padding: 12px;
    border-radius: 6px;
    border-left: 3px solid #e5e7eb;
  }

  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
      margin: 20px;
    }

    .detail-row {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .modal-header {
      padding: 16px 20px 0;
    }

    .modal-body {
      padding: 0 20px 20px;
    }
  }
</style>
