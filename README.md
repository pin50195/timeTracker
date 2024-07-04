# Time Tracker

[網頁部署](https://pin50195.github.io/timeTracker/)

## 1.製作動機

- 時間管理能更有效掌握工作(學習)進度，使用現有的 Time Tracker 並不順手，故製作符合自己需求的 Time Tracker
- Todo List 升級版，在運用 LocalStorage 儲存資料及 MergeSort 排序歷史資料基礎之上，增加計時器及圖表呈現功能

## 2.技術運用

- HTML
- CSS：Scss、RWD
- JavaScript：VanillaJS、LocalStorage、MergeSort
- Library：Chart.js

## 3.功能介紹

    Time Tracker有兩種紀錄時間方式：系統計時、人工輸入

### 3.1 Dashboard Page

![Dashboard Page](https://github.com/pin50195/timeTracker/assets/156511146/d4b3263c-2eaf-4b0c-81ff-b54456518b99)


- **What are you working on?**

        - 系統計時
        - 暫停按鈕：即使暫時中斷工作(學習)，也不會影響時間記錄的準確性
        - 停止按鈕：點選按鈕同時，資料存入 LocalStorage，同步更新圖表
        - 時間紀錄：使用 setInterval，呈現目前計時的時間

![Demo-system timer](https://github.com/pin50195/timeTracker/assets/156511146/31f0aad0-9bca-4724-bd15-d8e00f157488)

- **Latest Activity**

          - 人工輸入：右上角 + 按鈕，可人工輸入系統未記錄到的任務時間
          - 歷史資料
            - 呈現：目前最新十筆歷史資料，由上至下排序方式為 新 -> 舊
            - 刪除：點選每筆最右方垃圾桶按鈕

  ![Demo-manual input](https://github.com/pin50195/timeTracker/assets/156511146/f62fc3fa-f176-40c8-ab9a-067adf9a9aef)

- **Today's report**

        - 使用 Chart.js Doughnut Chart
        - 顯示「當日」各項任務總投入時間
        - 各項任務時間也許會很零碎，此圖表能一目了然，無須人工加總

- **Weekly report**

        - 使用 Chart.js Stacked Bar Chart
        - 顯示「每週」各項任務總投入時間
        - 回顧當週每項任務投入時間，作為調整投入時間的參考資料

### 3.2 History Page

    - 歷史資料
      - 資料呈現：視覺化呈現所有 LocalStorage 資料，與 Dashboard Task Type 顏色相呼應
      - 資料排序：使用 MergeSort，由上至下排序方式為 新 -> 舊
    - 刪除功能
      - 逐筆刪除：點選每筆最右方垃圾桶按鈕
      - 多筆刪除：點選 Delete

![History Page](https://github.com/pin50195/timeTracker/assets/156511146/61c186da-d1fb-48ce-8547-acf636ecd399)

## 4.往後課題

    當時製作是以 Todo-List 為基礎，因此是以 VanillaJS 製作並搭配 LocalStorage ，
    之後打算運用react及資料庫的方式，調整較整潔的程式碼及將資料存放在資料庫。
