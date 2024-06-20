let tbody = document.getElementsByTagName("tbody");
let deleteAllData = document.querySelector(".delete-all-data");
let hamBurgerNavBar = document.querySelector(".ham-bar");
let navMenu = document.querySelector(".menu");
let navLink = document.querySelectorAll(".nav-link");
let myList = localStorage.getItem("list");
let myListArr = JSON.parse(myList);

// 月份英文對照表
const monthNames = [
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

// delet all data button
deleteAllData.addEventListener("click", () => {
  let delteteConfirm = confirm("Delete all data?");
  if (delteteConfirm) {
    localStorage.clear();
    location.reload();
  }
});

// load local storage data
if (myList !== null) {
  myListArr.forEach((element) => {
    let tableDataContainer = document.createElement("tr");
    tableDataContainer.classList.add("table-data-container");
    tableDataContainer.classList.add(`${element.task.toLowerCase()}-type`);

    let tableDate = document.createElement("td");
    tableDate.classList.add("table-date");
    tableDate.setAttribute("data-label", "Date");
    let month = (
      monthNames.findIndex((monthNames) => monthNames === element.month) + 1
    )
      .toString()
      .padStart(2, "0");

    let date = element.date.toString().padStart(2, "0");

    tableDate.innerHTML = `${element.year}/${month}/${date}`;

    let tableTask = document.createElement("td");
    tableTask.classList.add("table-task");
    tableTask.setAttribute("data-label", "Task Type");
    tableTask.innerHTML = `${element.task}`;

    let tableTime = document.createElement("td");
    tableTime.classList.add("table-time");
    tableTime.innerHTML = `${element.start} - ${element.end}`;
    tableTime.setAttribute("data-label", "Time");

    let tableHour = document.createElement("td");
    tableHour.classList.add("table-hour");
    tableHour.innerHTML = `${element.hours}hr`;
    tableHour.setAttribute("data-label", "Hour");

    let trash = document.createElement("td");
    let trashButton = document.createElement("button");
    trashButton.classList.add("btn");
    let iTag = document.createElement("i");
    iTag.classList.add("fa-regular");
    iTag.classList.add("fa-trash-can");
    trashButton.appendChild(iTag);
    trash.appendChild(trashButton);

    tableDataContainer.appendChild(tableDate);
    tableDataContainer.appendChild(tableTask);
    tableDataContainer.appendChild(tableTime);
    tableDataContainer.appendChild(tableHour);
    tableDataContainer.appendChild(trash);
    tbody[0].appendChild(tableDataContainer);

    trashButton.addEventListener("click", (e) => {
      let historyData = e.target.parentElement.parentElement.parentElement;
      let historyDate = historyData.children[0].textContent.split("/");
      let historyTime = historyData.children[2].textContent.split(" - ");

      historyData.addEventListener("animationend", () => {
        let myListArr = JSON.parse(localStorage.getItem("list"));
        myListArr.forEach((item, index) => {
          if (
            Number(item.year) == Number(historyDate[0]) &&
            monthNames.findIndex((monthNames) => monthNames === item.month) +
              1 ==
              Number(historyDate[1]) &&
            Number(item.date) == Number(historyDate[2]) &&
            historyTime[0] == item.start &&
            historyTime[1] == item.end &&
            historyData.children[3].textContent == `${item.hours}hr`
          ) {
            myListArr.splice(index, 1);
            localStorage.setItem("list", JSON.stringify(myListArr));
          }
        });
        historyData.remove();
      });
      historyData.style.animation = "scaleDown 0.3s forwards";
    });
  });
}
