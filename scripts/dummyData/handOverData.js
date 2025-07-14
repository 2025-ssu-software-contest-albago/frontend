export const handoverData = {
  "spaces": [
    {
      "id": "teamSpace_id1", // 팀 공간 ID
      "handover": {
        "tabs": [
          {
            "id": "tab_open",
            "name": "오픈",
            "notes": [
              {
                "id": "note_001",
                "title": "청소",
                "content": "매장 바닥과 테이블 청소 잘해주세요",
                "createdAt": "2025-07-12T08:15:00Z",
                "updatedAt": "2025-07-12T08:15:00Z",
              },
              {
                "id": "note_002",
                "title": "재고 확인 및 진열",
                "content": "재고확인 잘부탁드려요 꼼꼼하게",
                "createdAt": "2025-07-12T08:15:00Z",
                "updatedAt": "2025-07-12T08:15:00Z",
              }
            ]
          },
          {
            "id": "tab_close",
            "name": "마감",
            "notes": [
              {
                "id": "note_010",
                "title": "POS 정산",
                "content": "오늘 매출 정산 후 POS 시스템에 입력해주세요",
                "createdAt": "2025-07-12T08:15:00Z",
                "updatedAt": "2025-07-12T08:15:00Z",
              }
            ]
          }
        ]
      }
    },
    {
      "id": "teamSpace_id2", // 팀 공간 ID
      "handover": {
        "tabs": [
          {
            "id": "tab_open_gangnam",
            "name": "오픈",
            "notes": [
              {
                "id": "note_100",
                "title": "간판 전등 점검",
                "content": "간판 불이 잘 들어오는지 매일 아침 확인해주세요",
                "createdAt": "2025-07-12T08:15:00Z",
                "updatedAt": "2025-07-12T08:15:00Z",
              },
              {
                "id": "note_101",
                "title": "커피머신 예열",
                "content": "예열 후 샷 뽑아보고 맛 이상 없는지 테스트",
                "createdAt": "2025-07-12T08:30:00Z",
                "updatedAt": "2025-07-12T08:30:00Z"
              }
            ]
          },
          {
            "id": "tab_middle_gangnam",
            "name": "미들",
            "notes": [
              {
                "id": "note_110",
                "title": "점심 피크 인원 배치 확인",
                "content": "테이블 번호별 서버 지정하기",
                "createdAt": "2025-07-12T08:30:00Z",
                "updatedAt": "2025-07-12T12:00:00Z",
              }
            ]
          },
          {
            "id": "tab_close_gangnam",
            "name": "마감",
            "notes": [
              {
                "id": "note_120",
                "title": "냉장고 온도 체크",
                "content": "모든 냉장/냉동 온도 기록",
                "createdAt": "2025-07-12T08:30:00Z",
                "updatedAt": "2025-07-12T21:30:00Z"
              },
              {
                "id": "note_121",
                "title": "마감 후 외부 조명 꺼짐 확인",
                "content": "외부 조명, 간판, 출입구 전등 OFF 확인",
                "createdAt": "2025-07-12T08:30:00Z",
                "updatedAt": "2025-07-12T21:45:00Z"
              }
            ]
          }
        ]
      }
    }
  ]
};
