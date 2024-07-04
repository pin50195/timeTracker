// 從 html 中獲取 tag
let timerRecord = document.querySelector("p.time");
let timerTaskType = document.getElementsByClassName("timer-select");
let startRecordButton = document.querySelector("button.start");
let stopRecordButton = document.querySelector("button.stop");
let addMyFormButton = document.querySelector("button.add");
let activiityData = document.querySelector(".activiity-data");
let myForm = document.getElementById("myForm");
let myFormContainer = document.querySelector(".form-container");
let closeMyFormButton = document.querySelector(".close-btn");
let submitMyFormBtn = document.querySelector(".submit-btn");
let resetMyFormBtn = document.querySelector(".reest-btn");
let hamBurgerNavBar = document.querySelector(".ham-bar");
let navMenu = document.querySelector(".menu");
let navLink = document.querySelectorAll(".nav-link");

//declare chart
let donutChart;
let stackedBarChart;
let selectedIndex;

// timer相關設定
let time = 0;
let myInterval = -1;
let calculate = { start: null, end: null, time: time };

// 抓取當下使用的時間
let dateObject = new Date();
let currentYear = dateObject.getFullYear();
let currentMonth = dateObject.getMonth();
let currentDate = dateObject.getDate();
let currentDay = dateObject.getDay();
let currentHour = dateObject.getHours();
let currentMin = dateObject.getMinutes();

// 月份英文對照表
const monthNamesEn = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// hamburger nav bar button
hamBurgerNavBar.addEventListener("click", (e) => {
  navMenu.classList.toggle("active");
  hamBurgerNavBar.classList.toggle("active");
});

// click nav link
navLink.forEach((list) => {
  list.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamBurgerNavBar.classList.remove("active");
  });
});

//timer開始按鈕 - 計時任務花費時間
startRecordButton.addEventListener("click", (e) => {
  //確認TaskType是否已填寫
  if (myInterval === -1) {
    if (timerTaskType[0].value == "null") {
      alert("請輸入TaskType");
    } else {
      //紀錄開始時間

      dateObject = new Date();
      currentHour = dateObject.getHours().toString().padStart(2, "0");
      currentMin = dateObject.getMinutes().toString().padStart(2, "0");
      calculate.start = `${currentHour} : ${currentMin}`;

      e.target.classList.toggle("fa-solid");
      e.target.classList.toggle("fa-play");
      e.target.classList.toggle("fa-regular");
      e.target.classList.toggle("fa-circle-pause");
      e.target.classList.toggle("toggle");
      timerTaskType[0].setAttribute("disabled", true);

      // 開始計時
      myInterval = setInterval(() => {
        time++;

        let hours = Math.floor(time / 60 / 60)
          .toString()
          .padStart(2, "0");
        let mins = (Math.floor(time / 60) % 60).toString().padStart(2, "0");
        let secs = (time % 60).toString().padStart(2, "0");

        timerRecord.innerHTML = ` ${hours} : ${mins} : ${secs}`;
      }, 1000);
    }
  } else {
    // 開始計時後，暫停計時
    e.target.classList.toggle("fa-solid");
    e.target.classList.toggle("fa-play");
    e.target.classList.toggle("fa-regular");
    e.target.classList.toggle("fa-circle-pause");
    e.target.classList.toggle("toggle");

    // 將已計時的time儲存起來
    calculate.time = time;

    clearInterval(myInterval);
    myInterval = -1;
  }
});

// Latest Activity 製作 Activity Data
stopRecordButton.addEventListener("click", (e) => {
  //確認TaskType是否已填寫
  if (timerTaskType[0].value == "null") {
    alert("請輸入TaskType");
  }
  //確認是否已執行開始按鈕
  else if (calculate.start == null) {
    alert("尚未執行開始");
  } else {
    let stopRecordConfirm = confirm("Stop record?");
    if (stopRecordConfirm) {
      if (
        startRecordButton.children[0].className.includes(
          "fa-regular fa-circle-pause"
        )
      ) {
        startRecordButton.children[0].classList.remove(
          "fa-regular",
          "fa-circle-pause"
        );
        startRecordButton.children[0].classList.add(
          "fa-solid",
          "fa-play",
          "toggle"
        );
      }

      //紀錄結束時間
      dateObject = new Date();
      currentHour = dateObject.getHours().toString().padStart(2, "0");
      currentMin = dateObject.getMinutes().toString().padStart(2, "0");
      calculate.end = `${currentHour} : ${currentMin}`;

      // 將已計時的time儲存起來
      calculate.time = time;

      //create databox
      let newDataBox = document.createElement("div");
      newDataBox.classList.add("databox");

      let newDataTime = document.createElement("div");
      newDataTime.classList.add("dataTime");
      newDataTime.innerHTML = `${currentYear} <br /> ${monthNamesEn[currentMonth]}.${currentDate} `;

      let newTask = document.createElement("div");
      newTask.classList.add("task");
      newTask.innerHTML = `${calculate.start} - ${calculate.end} <br /> ${timerTaskType[0].value}`;

      let newDataHours = document.createElement("div");
      newDataHours.classList.add("dataHours");
      newDataHours.innerHTML = `${(calculate.time / 60 / 60).toFixed(1)}hr`;

      //delete button
      let newTrashBtn = document.createElement("button");
      newTrashBtn.classList.add("trash", "btn");

      let newITag = document.createElement("i");
      newITag.classList.add("fa-regular", "fa-trash-can");

      newTrashBtn.appendChild(newITag);
      newTrashBtn.addEventListener("click", (e) => {
        let deleteDataConfirm = confirm("Delete Data?");
        if (deleteDataConfirm) {
          let taskItem = e.target.parentElement.parentElement;
          taskItem.addEventListener("animationend", () => {
            let myListArr = JSON.parse(localStorage.getItem("list"));
            myListArr.forEach((item, index) => {
              if (
                `${item.year}  ${item.month}.${item.date} ` ==
                  taskItem.children[0].textContent &&
                `${item.start} - ${item.end}  ${item.task}` ==
                  taskItem.children[1].textContent &&
                `${item.hours}hr` == taskItem.children[2].textContent
              ) {
                myListArr.splice(index, 1);
                localStorage.setItem("list", JSON.stringify(myListArr));
              }
            });

            taskItem.remove();
            setdonutChart();
            setBarChart();
          });
          taskItem.style.animation = "scaleDown 0.3s forwards";
        }
      });

      // appendChild
      newDataBox.appendChild(newDataTime);
      newDataBox.appendChild(newTask);
      newDataBox.appendChild(newDataHours);
      newDataBox.appendChild(newTrashBtn);
      activiityData.prepend(newDataBox);

      //資料呈現時的動畫
      newDataBox.style.animation = "scaleUp 0.4s forwards";

      // create object
      let myData = {
        year: currentYear,
        month: monthNamesEn[currentMonth],
        date: currentDate,
        task: timerTaskType[0].value,
        hours: (calculate.time / 60 / 60).toFixed(1),
        start: calculate.start,
        end: calculate.end,
      };

      //store data into an array
      let myList = localStorage.getItem("list");

      if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myData]));
      } else {
        let myListArr = JSON.parse(myList);
        myListArr.unshift(myData);
        localStorage.setItem("list", JSON.stringify(myListArr));
      }
      // 結束計時
      clearInterval(myInterval);
      myInterval = -1;
      time = 0;
      timerRecord.innerHTML = ` 00 : 00 : 00`;
      timerTaskType[0].removeAttribute("disabled");
      timerTaskType[0].value = "null";

      setdonutChart();
      setBarChart();
    }
  }
});

// Form相關
// create form add button
addMyFormButton.addEventListener("click", (e) => {
  myForm.classList.toggle("form-popup");
});

// create form close button
closeMyFormButton.addEventListener("click", (e) => {
  myForm.classList.toggle("form-popup");
});

// create form reset button
resetMyFormBtn.addEventListener("click", () => {
  myFormContainer.reset();
});

// create form submit button
submitMyFormBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let formDate = myFormContainer[2].value.split("-");
  let formStartTimeArr = myFormContainer[0].value.split(":");
  let formStartTime =
    Number(formStartTimeArr[0]) * 60 + Number(formStartTimeArr[1]);

  let formEndTimeArr = myFormContainer[1].value.split(":");
  let formEndTime = Number(formEndTimeArr[0]) * 60 + Number(formEndTimeArr[1]);

  if (
    myFormContainer[0].value == "" ||
    myFormContainer[1].value == "" ||
    myFormContainer[2].value == "" ||
    myFormContainer[3].value == ""
  ) {
    alert("請確認每隔欄位皆已填寫");
  } else if (formStartTime >= formEndTime) {
    alert("請確認起訖時間");
  } else {
    // create databox
    let newDataBox = document.createElement("div");
    newDataBox.classList.add("databox");

    let newDataTime = document.createElement("div");
    newDataTime.classList.add("dataTime");

    newDataTime.innerHTML = `${Number(formDate[0])} <br /> ${
      monthNamesEn[Number(formDate[1]) - 1]
    }.${formDate[2]} `;

    let newTask = document.createElement("div");
    newTask.classList.add("task");
    timerTaskType[0].value = myFormContainer[3].value;
    newTask.innerHTML = `${formStartTimeArr[0]} : ${formStartTimeArr[1]} - ${formEndTimeArr[0]} : ${formEndTimeArr[1]} <br /> ${myFormContainer[3].value}`;
    let newDataHours = document.createElement("div");
    newDataHours.classList.add("dataHours");
    newDataHours.innerHTML = `${((formEndTime - formStartTime) / 60).toFixed(
      1
    )}hr`;

    //delete button
    let newTrashBtn = document.createElement("button");
    newTrashBtn.classList.add("trash", "btn");

    let newITag = document.createElement("i");
    newITag.classList.add("fa-regular", "fa-trash-can");
    newTrashBtn.appendChild(newITag);

    newTrashBtn.addEventListener("click", (e) => {
      let deleteDataConfirm = confirm("Delete Data?");
      if (deleteDataConfirm) {
        let taskItem = e.target.parentElement.parentElement;

        taskItem.addEventListener("animationend", () => {
          let myListArr = JSON.parse(localStorage.getItem("list"));
          myListArr.forEach((item, index) => {
            if (
              `${item.year}  ${item.month}.${item.date} ` ==
                taskItem.children[0].textContent &&
              `${item.start} - ${item.end}  ${item.task}` ==
                taskItem.children[1].textContent &&
              `${item.hours}hr` == taskItem.children[2].textContent
            ) {
              myListArr.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArr));
            }
          });

          taskItem.remove();
          setdonutChart();
          setBarChart();
        });
        taskItem.style.animation = "scaleDown 0.3s forwards";
        setdonutChart();
        setBarChart();
      }
    });
    // appendChild
    newDataBox.appendChild(newDataTime);
    newDataBox.appendChild(newTask);
    newDataBox.appendChild(newDataHours);
    newDataBox.appendChild(newTrashBtn);
    activiityData.prepend(newDataBox);

    //資料呈現時的動畫
    newDataBox.style.animation = "scaleUp 0.4s forwards";

    // create object
    let myData = {
      year: Number(formDate[0]),
      month: monthNamesEn[Number(formDate[1]) - 1],
      date: Number(formDate[2]),
      task: timerTaskType[0].value,
      hours: ((formEndTime - formStartTime) / 60).toFixed(1),
      start: `${formStartTimeArr[0]} : ${formStartTimeArr[1]}`,
      end: `${formEndTimeArr[0]} : ${formEndTimeArr[1]}`,
    };

    //store data into an array
    let myList = localStorage.getItem("list");
    if (myList == null) {
      localStorage.setItem("list", JSON.stringify([myData]));
    } else {
      let myListArr = JSON.parse(myList);
      myListArr.unshift(myData);
      localStorage.setItem("list", JSON.stringify(myListArr));
    }

    setdonutChart();
    setBarChart();
    myFormContainer.reset();
    myForm.classList.toggle("form-popup");
  }
});

loadData();

function loadData() {
  let list = JSON.parse(localStorage.getItem("list"));
  if (!list || list.length === 0) return;

  let sortedArr = mergeSort(list);
  localStorage.setItem("list", JSON.stringify(sortedArr.reverse()));
  let myList = localStorage.getItem("list");
  let myListArr = JSON.parse(myList);

  if (!activiityData) return;

  if (myList !== null) {
    // 移除 Latest Activity 資料
    let lengthOfActiviityData = activiityData.children.length;
    for (let i = 0; i < lengthOfActiviityData; i++) {
      activiityData.children[0].remove();
    }

    //create Latest Activity 資料
    myListArr.forEach((item, index) => {
      if (index <= 9) {
        let newDataBox = document.createElement("div");
        newDataBox.classList.add("databox");

        let newDataTime = document.createElement("div");
        newDataTime.classList.add("dataTime");

        let newTask = document.createElement("div");
        newTask.classList.add("task");

        let newDataHours = document.createElement("div");
        newDataHours.classList.add("dataHours");

        let newTrashBtn = document.createElement("button");
        newTrashBtn.classList.add("trash", "btn");

        let newITag = document.createElement("i");
        newITag.classList.add("fa-regular", "fa-trash-can");

        newTrashBtn.appendChild(newITag);

        // 將資料放置innerHTML
        newDataTime.innerHTML = `${item.year} <br /> ${item.month}.${item.date} `;
        newTask.innerHTML = `${item.start} - ${item.end} <br /> ${item.task}`;
        newDataHours.innerHTML = `${item.hours}hr`;

        // appendChild
        newDataBox.appendChild(newDataTime);
        newDataBox.appendChild(newTask);
        newDataBox.appendChild(newDataHours);
        newDataBox.appendChild(newTrashBtn);
        activiityData.appendChild(newDataBox);

        //delete button;
        newTrashBtn.addEventListener("click", (e) => {
          let deleteDataConfirm = confirm("Delete Data?");
          if (deleteDataConfirm) {
            let taskItem = e.target.parentElement.parentElement;
            taskItem.addEventListener("animationend", () => {
              let myListArr = JSON.parse(localStorage.getItem("list"));
              myListArr.forEach((item, index) => {
                if (
                  `${item.year}  ${item.month}.${item.date} ` ==
                    taskItem.children[0].textContent &&
                  `${item.start} - ${item.end}  ${item.task}` ==
                    taskItem.children[1].textContent &&
                  `${item.hours}hr` == taskItem.children[2].textContent
                ) {
                  myListArr.splice(index, 1);
                  localStorage.setItem("list", JSON.stringify(myListArr));
                }
              });

              taskItem.remove();
              setdonutChart();
              setBarChart();
            });
            taskItem.style.animation = "scaleDown 0.3s forwards";
          }
        });
      }
    });
  }
  setdonutChart();
  setBarChart();
}

function setdonutChart() {
  //從localStorage 抓取 donut chart 中所需資料
  let myList = localStorage.getItem("list");
  let myListArr = JSON.parse(myList);
  let work = 0;
  let study = 0;
  let exercise = 0;

  myListArr.forEach((e) => {
    if (
      e.task === "Work" &&
      e.year === currentYear &&
      e.month === monthNamesEn[currentMonth] &&
      e.date === currentDate
    ) {
      work += Number(e.hours);
    }
    if (
      e.task === "Study" &&
      e.year === currentYear &&
      e.month === monthNamesEn[currentMonth] &&
      e.date === currentDate
    ) {
      study += Number(e.hours);
    }
    if (
      e.task === "Exercise" &&
      e.year === currentYear &&
      e.month === monthNamesEn[currentMonth] &&
      e.date === currentDate
    ) {
      exercise += Number(e.hours);
    }
  });

  // Update the chart data and labels
  const newData = [work, study, exercise];

  // If donutChart already exists, update its data; otherwise, create a new chart
  if (donutChart) {
    // Update the data of the existing chart
    donutChart.data.datasets[0].data = newData;

    // Update the chart to reflect the new data and center text
    donutChart.update();
  } else {
    const canvas = document.getElementById("donutChart");
    let newLegendClickHandler = function (e, legendItem, legend) {
      let chart = legend.chart;
      selectedIndex = legendItem.index;

      // Toggle visibility of the data point
      chart.toggleDataVisibility(selectedIndex);

      // Update the chart
      chart.update();
    };

    // Function to calculate the sum of visible data points
    function calculateVisibleDataSum(chart) {
      const data = chart.data.datasets[0].data;
      const hiddenIndices = chart._hiddenIndices;
      let sum = 0;

      // Iterate through each data point
      data.forEach((value, index) => {
        // If the data point is not hidden, add its value to the sum
        if (!hiddenIndices[index]) {
          sum += value;
        }
      });

      return sum;
    }

    // Plugin to display text in the center of the doughnut chart
    const centerTextPlugin = {
      id: "centerText",
      afterDraw: function (chart) {
        const { ctx, chartArea } = chart;

        // Calculate the center of the chart
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        // Calculate the sum of visible data points
        const valueToDisplay = calculateVisibleDataSum(chart);

        // Set up the text style
        ctx.save();
        ctx.font = "bold 24px Palanquin Dark";
        ctx.fillStyle = "rgba(50, 50, 50, 0.7)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw the text in the center of the chart
        ctx.fillText(`${valueToDisplay.toFixed(1)}hr`, centerX, centerY);
        ctx.restore();
      },
    };

    const doughnutData = {
      labels: ["work", "study", "exercise"],
      datasets: [
        {
          label: "Time",
          color: "#000",
          data: [work, study, exercise],
          backgroundColor: ["#FFCD38", "#85E0A3", "#FF4949"],
          hoverOffset: 10,
          hoverBackgroundColor: ["#FFCD38", "#85E0A3", "#FF4949"],
        },
      ],
    };

    // Add the plugin to the chart configuration
    const config = {
      type: "doughnut",
      data: doughnutData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 50,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "right",
            onClick: newLegendClickHandler,
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              font: {
                size: 16,
                family: "Palanquin Dark",
              },
            },
          },
        },
      },
      plugins: [centerTextPlugin], // Register the plugin
    };

    // Create the chart with the config
    donutChart = new Chart(canvas, config);
  }
}

function setBarChart() {
  let weekDataLabels = [];
  let checkLocalStorageTime = [];

  function getLastNDays(n) {
    let dates = [];
    for (let i = 0; i < n; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1, // Months are 0-based in JavaScript Date object
        date: date.getDate(),
      });
    }
    return dates;
  }

  const last7Days = getLastNDays(7);

  last7Days.forEach((dateObj) => {
    const dateString = `${dateObj.year}-${dateObj.month < 10 ? "0" : ""}${
      dateObj.month
    }-${dateObj.date < 10 ? "0" : ""}${dateObj.date}`;
    const dayOfWeek = getDayOfWeek(dateString);
    weekDataLabels.unshift(`${dateObj.month}/${dateObj.date}(${dayOfWeek})`);
    checkLocalStorageTime.unshift(dateObj);
  });

  //從localStorage 抓取 bar chart 中所需資料
  let myList = localStorage.getItem("list");
  let myListArr = JSON.parse(myList);
  let workDataLabels = [];
  let studyDataLabels = [];
  let exerciseDataLabels = [];

  checkLocalStorageTime.forEach((e) => {
    let work = 0;
    let study = 0;
    let exercise = 0;

    for (let i = 0; i < myListArr.length; i++) {
      if (
        e.year == myListArr[i].year &&
        monthNamesEn[Number(e.month) - 1] == myListArr[i].month &&
        e.date == myListArr[i].date
      ) {
        if (myListArr[i].task == "Work") {
          work += Number(myListArr[i].hours);
        }
        if (myListArr[i].task == "Study") {
          study += Number(myListArr[i].hours);
        }
        if (myListArr[i].task == "Exercise") {
          exercise += Number(myListArr[i].hours);
        }
      }
    }
    workDataLabels.push(work.toFixed(1));
    studyDataLabels.push(study.toFixed(1));
    exerciseDataLabels.push(exercise.toFixed(1));
  });

  // Update the chart data and labels
  const newData = [workDataLabels, studyDataLabels, exerciseDataLabels];

  // If setBarChart already exists, update its data; otherwise, create a new chart
  if (stackedBarChart) {
    // Update the data of the existing chart

    stackedBarChart.data.datasets[0].data = newData[0];
    stackedBarChart.data.datasets[1].data = newData[1];
    stackedBarChart.data.datasets[2].data = newData[2];

    stackedBarChart.data.labels = weekDataLabels;

    // Update the chart to reflect the new data and center text
    stackedBarChart.update();
  } else {
    const canvas = document.getElementById("barChart");

    const data = {
      labels: [
        weekDataLabels[0],
        weekDataLabels[1],
        weekDataLabels[2],
        weekDataLabels[3],
        weekDataLabels[4],
        weekDataLabels[5],
        weekDataLabels[6],
      ],
      datasets: [
        {
          label: "work",
          data: [
            workDataLabels[0],
            workDataLabels[1],
            workDataLabels[2],
            workDataLabels[3],
            workDataLabels[4],
            workDataLabels[5],
            workDataLabels[6],
          ],
          backgroundColor: "#FFCD38",
          borderRadius: 5,

          hoverBackgroundColor: "#FFCD38",
        },
        {
          label: "study",
          data: [
            studyDataLabels[0],
            studyDataLabels[1],
            studyDataLabels[2],
            studyDataLabels[3],
            studyDataLabels[4],
            studyDataLabels[5],
            studyDataLabels[6],
          ],
          backgroundColor: "#85E0A3",
          borderRadius: 5,
          hoverBackgroundColor: "#85E0A3",
        },
        {
          label: "exercise",
          data: [
            exerciseDataLabels[0],
            exerciseDataLabels[1],
            exerciseDataLabels[2],
            exerciseDataLabels[3],
            exerciseDataLabels[4],
            exerciseDataLabels[5],
            exerciseDataLabels[6],
          ],
          backgroundColor: "#FF4949",
          borderRadius: 5,
          hoverBackgroundColor: "#FF4949",
        },
      ],
    };

    const sumDataLabel = {
      id: "sumDataLabel",
      afterDatasetsDraw(chart, args, plugins) {
        const {
          ctx,
          scales: { y },
        } = chart;

        const datasetMeta0 = chart.getDatasetMeta(0);
        const datasetMeta1 = chart.getDatasetMeta(1);
        const datasetMeta2 = chart.getDatasetMeta(2);

        datasetMeta0.data.forEach((dataPoint, index) => {
          let y0 = datasetMeta0.data[index].y;
          let y1 = datasetMeta1.data[index].y;
          let y2 = datasetMeta2.data[index].y;

          if (y0 > 0 || y1 > 0 || y2 > 0) {
            y0 = datasetMeta0.hidden ? 1000 : y0;
            y1 = datasetMeta1.hidden ? 1000 : y1;
            y2 = datasetMeta2.hidden ? 1000 : y2;

            const value = Math.min(y0, y1, y2);

            ctx.save();
            ctx.font = "bold 12px Palanquin Dark";
            ctx.fillStyle = "rgba(50, 50, 50, 0.7)";
            ctx.textAlign = "center";
            ctx.fillText(
              `${y.getValueForPixel(value).toFixed(1)}hr`,
              dataPoint.x,
              value - 16
            );
          }
        });
      },
    };

    const config = {
      type: "bar",
      data: data,

      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 25,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: {
              font: {
                size: 14,
                weight: 600,
              },
            },
          },
          y: {
            stacked: true,
            grid: { display: false },
            beginAtZerO: true,
            grace: 1,
            ticks: {
              stepSize: 1,
              font: {
                size: 14,
                weight: 600,
              },
            },
          },
        },

        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              usePointStyle: true,
              pointStyle: "rectRounded",
              font: {
                size: 16,
              },
            },
          },
          datalabels: {
            anchor: "end",
            align: "top",
            font: {
              size: 16,
              family: "Palanquin Dark",
            },
          },
        },
      },

      plugins: [sumDataLabel],
    };

    stackedBarChart = new Chart(canvas, config);
  }
}

function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayNames[dayOfWeek];
}

// 重新排序Latest Activity資料
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].year) < Number(arr2[j].year)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].year) > Number(arr2[j].year)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].year) == Number(arr2[j].year)) {
      if (
        monthNamesEn.indexOf(arr1[i].month) <
        monthNamesEn.indexOf(arr2[j].month)
      ) {
        result.push(arr1[i]);
        i++;
      } else if (
        monthNamesEn.indexOf(arr1[i].month) >
        monthNamesEn.indexOf(arr2[j].month)
      ) {
        result.push(arr2[j]);
        j++;
      } else if (
        monthNamesEn.indexOf(arr1[i].month) ==
        monthNamesEn.indexOf(arr2[j].month)
      ) {
        if (Number(arr1[i].date) < Number(arr2[j].date)) {
          result.push(arr1[i]);
          i++;
        } else if (Number(arr1[i].date) > Number(arr2[j].date)) {
          result.push(arr2[j]);
          j++;
        } else if (Number(arr1[i].date) == Number(arr2[j].date)) {
          let arr1StartTime = arr1[i].start.split(" : ");
          let arr2StartTime = arr2[i].start.split(" : ");

          if (Number(arr1StartTime[0]) < Number(arr2StartTime[0])) {
            result.push(arr1[i]);
            i++;
          } else if (Number(arr1StartTime[0]) > Number(arr2StartTime[0])) {
            result.push(arr2[j]);
            j++;
          } else if (Number(arr1StartTime[0]) == Number(arr2StartTime[0])) {
            if (Number(arr1StartTime[1] < Number(arr2StartTime[1]))) {
              result.push(arr1[i]);
              i++;
            } else if (Number(arr1StartTime[1]) > Number(arr2StartTime[1])) {
              result.push(arr2[j]);
              j++;
            } else if (Number(arr1StartTime[1]) == Number(arr2StartTime[1])) {
              if (Number(arr1[i].hours) < Number(arr2[j].hours)) {
                result.push(arr1[i]);
                i++;
              } else {
                result.push(arr2[j]);
                j++;
              }
            }
          }
        }
      }
    }
  }
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid, arr.length);

    return mergeTime(mergeSort(left), mergeSort(right));
  }
}
