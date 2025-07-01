export const userData = {
    email: "chun4582@naver.com",
    name: "천재민",
    phone: "010-1234-5678",
    spaces: [
        {
            id: "personalSpace_id1",
            type: "personal",
            name: "천재민의 개인공간",
            imageUrl: "null",
            lastUpdatedAt: "2025-07-01T09:02:11Z",
            schedules: [
                {
                    id: "schedule_id1",
                    title: "롯데리아",
                    startTime: "2025-07-01T10:00:00Z",
                    endTime: "2025-07-01T11:00:00Z",
                    memo: "개인적인 메모~~",
                    color: "#FF5733"
                },
                {
                    id: "schedule_id2",
                    title: "맘스터치",
                    startTime: "2025-07-02T14:00:00Z",
                    endTime: "2025-07-02T16:00:00Z",
                    memo: "점심 약속",
                    color: "#33A1FF"
                },
                {
                    id: "schedule_id3",
                    title: "헬스장",
                    startTime: "2025-07-03T18:30:00Z",
                    endTime: "2025-07-03T19:30:00Z",
                    memo: "등운동 날!",
                    color: "#28B463"
                },
                {
                    id: "schedule_id4",
                    title: "스터디",
                    startTime: "2025-07-04T09:00:00Z",
                    endTime: "2025-07-04T11:00:00Z",
                    memo: "토익 스터디",
                    color: "#9B59B6"
                },
                {
                    id: "schedule_id5",
                    title: "치과 예약",
                    startTime: "2025-07-05T13:00:00Z",
                    endTime: "2025-07-05T13:30:00Z",
                    memo: "스케일링",
                    color: "#E67E22"
                },
                {
                    id: "schedule_id6",
                    title: "버거킹",
                    startTime: "2025-07-01T14:00:00Z",
                    endTime: "2025-07-01T17:00:00Z",
                    memo: "개인적인 메모6~~",
                    color: "#E67E22"
                },
            ]
        },
        {
            id: "teamSpace_id1",
            type: "team",
            name: "천재민의 개인공간",
            imageUrl: "null",
            lastUpdatedAt: "2025-07-01T09:02:11Z",
            schedules: [
                {
                    id: "schedule_id1",
                    title: "천재민",
                    startTime: "2025-07-01T10:00:00Z",
                    endTime: "2025-07-01T11:00:00Z",
                    color: "#FF5733"
                },
                {
                    id: "schedule_id2",
                    title: "윤찬수",
                    startTime: "2025-07-02T10:00:00Z",
                    endTime: "2025-07-02T12:00:00Z",
                    color: "#33A1FF"
                },
                {
                    id: "schedule_id3",
                    title: "최서연",
                    startTime: "2025-07-03T15:00:00Z",
                    endTime: "2025-07-03T17:00:00Z",
                    color: "#28B463"
                },
                {
                    id: "schedule_id4",
                    title: "팀 회의",
                    startTime: "2025-07-04T16:00:00Z",
                    endTime: "2025-07-04T17:00:00Z",
                    color: "#9B59B6"
                },
                {
                    id: "schedule_id5",
                    title: "전체 워크샵",
                    startTime: "2025-07-05T09:00:00Z",
                    endTime: "2025-07-05T12:00:00Z",
                    color: "#E67E22"
                }
            ]
        }
    ]
};


// export const userData = {
//     email: "chun4582@naver.com",
//     name: "천재민",
//     phone: "010-1234-5678",
//     spaces: [
//         {
//             id: "personalSpace_id1",
//             type: "personal", //혹시나 id만으로는 개인공간, 팀공간 구분이 안될까봐 일단 추가해놨음
//             name: "천재민의 개인공간",
//             imageUrl: "null", //s3쓰긴 써야할 듯? 만약에 null일 경우 기본 이미지로 주도록 하기
//             lastUpdatedAt: "2025-07-01T09:02:11Z",
//             schedules: [
//                 {
//                     id: "schedule_id1",
//                     title: "롯데리아",
//                     startTime: "2025-07-01T10:00:00Z",
//                     endTime: "2025-07-01T11:00:00Z",
//                     memo: "개인적인 메모~~",
//                     color: "#FF5733"
//                 },
//                 {
//                     id: "schedule_id2",
//                     title: "맘스터치",
//                     startTime: "2025-06-30T10:00:00Z",
//                     endTime: "2025-06-30T11:00:00Z",
//                     memo: "개인적인 메모~~2",
//                     color: "#FF5733"
//                 }
//             ]
//         },
//         {
//             id: "teamSpace_id1",
//             type: "team", //혹시나 id만으로는 개인공간, 팀공간 구분이 안될까봐 일단 추가해놨음
//             name: "천재민의 개인공간",
//             imageUrl: "null",
//             lastUpdatedAt: "2025-07-01T09:02:11Z",
//             schedules: [
//                 {   //팀 일정에는 메모가 없음!, 이 부분도 팀원과 논의 해봐야 할 듯
//                     id: "schedule_id1",
//                     title: "천재민",
//                     startTime: "2025-07-01T10:00:00Z",
//                     endTime: "2025-07-01T11:00:00Z",
//                     color: "#FF5733"
//                 },
//                 {
//                     id: "schedule_id2",
//                     title: "윤찬수",
//                     startTime: "2025-06-30T10:00:00Z",
//                     endTime: "2025-06-30T11:00:00Z",
//                     color: "#FF5733"
//                 }
//             ]
//         },
//     ]
// }
