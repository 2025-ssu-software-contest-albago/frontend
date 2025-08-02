export const userData = {
  "id": "user_id1",
  "email": "chun4582@naver.com",
  "name": "천재민",
  "phone": "010-1234-5678",
  "adress": "미사강변서로 111-111",
  "spaces": [
    {
      "id": "personalSpace_id1",
      "type": "personal",
      "name": "천재민의 개인공간",
      "imageUrl": null,
      "lastUpdatedAt": "2025-07-01T09:02:11Z",
      "workPlaces": [
        {
          "id": "wp_lotteria",
          "name": "롯데리아",
          "color": "cherry",
          "hourlyWage": 9860,
          "weeklyAllowance": true,
          "nightAllowance": true,
          "nightRate": 150,
          "overtimeAllowance": true,
          "overtimeRate": 150,
          "holidayAllowance": true,
          "holidayRate": 150,
          "deductions": "4대 보험"
        },
        {
          "id": "wp_momstouch",
          "name": "맘스터치",
          "color": "watermelon",
          "hourlyWage": 10000,
          "weeklyAllowance": false,
          "nightAllowance": true,
          "nightRate": 150,
          "overtimeAllowance": false,
          "overtimeRate": 150,
          "holidayAllowance": true,
          "holidayRate": 150,
          "deductions": "4대 보험"
        },
        {
          "id": "wp_burgerking",
          "name": "버거킹",
          "color": "salmon",
          "hourlyWage": 11000,
          "weeklyAllowance": true,
          "nightAllowance": false,
          "nightRate": 150,
          "overtimeAllowance": true,
          "overtimeRate": 150,
          "holidayAllowance": false,
          "holidayRate": 150,
          "deductions": "4대 보험"
        },
        {
          "id": "wp_schoolpizza",
          "name": "스쿨피자",
          "color": "coral",
          "hourlyWage": 9500,
          "weeklyAllowance": true,
          "nightAllowance": true,
          "nightRate": 150,
          "overtimeAllowance": true,
          "overtimeRate": 150,
          "holidayAllowance": true,
          "holidayRate": 150,
          "deductions": "4대 보험"
        }
      ],
      "schedules": [
        {
          "id": "schedule_id1",
          "name": "롯데리아",
          "workPlaceId": "wp_lotteria",
          "startTime": "2025-07-01T09:00:00Z",
          "endTime": "2025-07-01T10:00:00Z",
          "memo": "개인적인 메모~~",
          "color": "orange",
          "hourlyWage": 9860
        },
        {
          "id": "schedule_id2",
          "name": "맘스터치",
          "workPlaceId": "wp_momstouch",
          "startTime": "2025-07-02T05:00:00Z",
          "endTime": "2025-07-02T07:00:00Z",
          "memo": "점심 약속",
          "color": "gold",
          "hourlyWage": 10000
        },
        {
          "id": "schedule_id3",
          "name": "스쿨피자",
          "workPlaceId": "wp_schoolpizza",
          "startTime": "2025-07-03T09:30:00Z",
          "endTime": "2025-07-03T10:30:00Z",
          "memo": "맛있는 피자!",
          "color": "amber",
          "hourlyWage": 9500
        },
        {
          "id": "schedule_id6",
          "name": "버거킹",
          "workPlaceId": "wp_burgerking",
          "startTime": "2025-07-01T05:00:00Z",
          "endTime": "2025-07-01T08:00:00Z",
          "memo": "개인적인 메모6~~",
          "color": "sunflower",
          "hourlyWage": 11000
        }
      ]
    },
    {
      "id": "teamSpace_id1",
      "type": "team",
      "name": "팀 공간",
      "imageUrl": null,
      "lastUpdatedAt": "2025-07-01T09:02:11Z",
      "members": [
        {
          "id": "user_id1",
          "name": "천재민",
          "email": "chun4582@naver.com",
          "phone": "010-1111-2222",
          "role": "admin",
          "color": "lime",
          "hourlyWage": 9860,
          "weeklyAllowance": true,
          "nightAllowance": true,
          "nightRate": 150,
          "overtimeAllowance": true,
          "overtimeRate": 150,
          "holidayAllowance": true,
          "holidayRate": 150,
          "deductions": "4대 보험"
        },
        {
          "id": "mem_kim",
          "name": "김지훈",
          "email": "kimjh@example.com",
          "phone": "010-1111-2222",
          "role": "admin",
          "color": "leaf",
          "hourlyWage": 9860,
          "weeklyAllowance": true,
          "nightAllowance": true,
          "nightRate": 150,
          "overtimeAllowance": true,
          "overtimeRate": 150,
          "holidayAllowance": true,
          "holidayRate": 150,
          "deductions": "4대 보험"
        },
        {
          "id": "mem_lee",
          "name": "이서연",
          "email": "leesy@example.com",
          "phone": "010-3333-4444",
          "role": "member",
          "color": "forest",
          "hourlyWage": 10000,
          "weeklyAllowance": false,
          "nightAllowance": true,
          "nightRate": 150,
          "overtimeAllowance": false,
          "overtimeRate": 150,
          "holidayAllowance": true,
          "holidayRate": 150,
          "deductions": "4대 보험"
        },
        {
          "id": "mem_park",
          "name": "박준영",
          "email": "parkjy@example.com",
          "phone": "010-5555-6666",
          "role": "member",
          "color": "emerald",
          "hourlyWage": 11000,
          "weeklyAllowance": true,
          "nightAllowance": false,
          "nightRate": 150,
          "overtimeAllowance": true,
          "overtimeRate": 150,
          "holidayAllowance": false,
          "holidayRate": 150,
          "deductions": "4대 보험"
        },
        {
          "id": "mem_choi",
          "name": "최민지",
          "email": "choimj@example.com",
          "phone": "010-7777-8888",
          "role": "member",
          "color": "mint",
          "hourlyWage": 9500,
          "weeklyAllowance": true,
          "nightAllowance": true,
          "nightRate": 150,
          "overtimeAllowance": true,
          "overtimeRate": 150,
          "holidayAllowance": true,
          "holidayRate": 150,
          "deductions": "4대 보험"
        }
      ],
      "schedules": [
        {
          "id": "schedule_id7",
          "name": "김지훈",
          "memberId": "mem_kim",
          "startTime": "2025-07-01T01:00:00Z",
          "endTime": "2025-07-01T02:00:00Z",
          "color": "teal",
          "hourlyWage": 9860
        },
        {
          "id": "schedule_id8",
          "name": "이서연",
          "memberId": "mem_lee",
          "startTime": "2025-07-02T01:00:00Z",
          "endTime": "2025-07-02T03:00:00Z",
          "color": "cyan",
          "hourlyWage": 10000
        },
        {
          "id": "schedule_id9",
          "name": "최민지",
          "memberId": "mem_choi",
          "startTime": "2025-07-03T06:00:00Z",
          "endTime": "2025-07-03T08:00:00Z",
          "color": "sky",
          "hourlyWage": 9500
        }
      ]
    }
  ]
}
