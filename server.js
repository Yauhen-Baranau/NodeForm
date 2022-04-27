const express = require("express");

const webserver = express();

const port = 80;

let formData = {
  myName: "",
  mySurename: "",
  myGender: "",
};

let isSecces = false;
let isError = false;

let h1 = null;
let form = null;

function resetForm() {
  h1 = isError ? "<h1>Заполните ВСЕ поля!</h1>" : "<h1>Заполните форму!</h1>";
  form = !isSecces
    ? `${h1}
    <form
    style="
      width: 200px;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    "
    method="get"
    action="/send"
    >
    <input
    style='
      background-color: ${isError && !formData.myName.length ? "red" : ""};
      '
      value="${formData.myName}"
      placeholder="имя"
      type="text"
      name="myName"
    />
    <input
    style='
    background-color: ${isError && !formData.mySurename.length ? "red" : ""};
    '
      value="${formData.mySurename}"
      placeholder="фамилия"
      type="text"
      name="mySurename"
     
    />
    <input
    style='
    background-color: ${isError && !formData.myGender.length ? "red" : ""};
    '
      value="${formData.myGender}"
      placeholder="пол"
      type="tel"
      name="myGender"
   
    />
    <input
      style="width: 100px; text-align: center"
      type="submit"
      value="отправить"
    />
    </form>`
    : `<h1>Форма принята!</h1>
    <form 
    method="get"
    action="/form"
    >
        <div> Имя: ${formData.myName} </div>
        <div> Фамилия: ${formData.mySurename} </div>
        <div> Пол: ${formData.myGender} </div>
        <input
        style="width: 100px; text-align: center; margin-top: 10px"
        type="submit"
        value="ОК"
      />
    </form>`;
}

function clearFormData() {
  formData.mySurename = "";
  formData.myName = "";
  formData.myGender = "";
}

webserver.get("/form", (req, res) => {
  resetForm();
  res.send(form);
});

webserver.get("/send", (req, res) => {
  formData = req.query;

  if (
    formData.mySurename.length &&
    formData.myName.length &&
    formData.myGender.length
  ) {
    isSecces = true;
    resetForm();
    res.send(form);
    isSecces = false;
    isError = false;
    clearFormData();
    return;
  }

  isError = true;
  resetForm();
  res.send(form);
});

webserver.listen(port, () => {
  console.log("web server running on port " + port);
});