const { randomUUID } = require("crypto");
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function getRandomChars(inputString, length) {
  if (length > inputString.length) {
    throw new Error(
      "Requested length is greater than the input string length."
    );
  }

  const shuffledChars = inputString
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  const randomChars = shuffledChars.slice(0, length);

  return randomChars;
}

function generateOrderId(user) {
  const rnduser = getRandomChars(user, 5);
  const userId = rnduser.padStart(4, "0");
  return (
    "ORDER-" +
    userId +
    "-" +
    getCurrentDateDMY().replace("/", "").replace("/", "") +
    "-" +
    randomUUID().substring(0, 13)
  );
}

const dateIsValidDMY = (date) => {
  date = date.split("/");
  if (date.length != 3) return false;
  if (date[0].length != 2) return false;
  if (date[1].length != 2) return false;
  if (date[2].length != 4) return false;
  date = [date[1], date[0], date[2]].join("/");

  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

const sequelizeDateOnlyToDMY = (dateOnly) => {
  date = dateOnly.split("-");
  return date[2] + "/" + date[1] + "/" + date[0];
};

const getCurrentDateDMY = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  return today;
};

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const getCurrentMonth = () => {
  return String(new Date().getMonth() + 1).padStart(2, "0");
};

const dmyStringToDate = (dmyString) => {
  let date = dmyString.split("/");
  return new Date([date[2], date[1], date[0]].join("-"));
};

const shuffle = (array) => {
  for (let index = 0; index < array.length; index++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    const temp = array[index];
    array[index] = array[randomIndex];
    array[randomIndex] = temp;
  }
};

const ABCto012 = (char) => {
  switch (char.toUpperCase()) {
    case "A":
      return 0;
    case "B":
      return 1;
    case "C":
      return 2;
    case "D":
      return 3;
    case "E":
      return 4;
    case "F":
      return 5;
    default:
      return -1;
  }
};

module.exports = { formatDate, generateOrderId };
