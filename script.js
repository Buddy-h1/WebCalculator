let expression = document.getElementById('expression');
let backward = document.getElementById('backward');

//Переменные для обычного счета
let leftOperand = "";
let sign = "";
let rightOperand = "";
let result = "";
let order = "";
let expNumInp = false;
let units = false;

//Вывод переменных в консоль
function status() {
    console.log("leftOperand = " + leftOperand);
    console.log("rightOperand = " + rightOperand);
    console.log("sign = " + sign);
    console.log("result = " + result);
    console.log("order = " + order);
    console.log(" ");
}

//Смена единицы измерения на радианы
function switchOnRad() {
    let unitsRad = document.getElementById("rad");
    let unitsDeg = document.getElementById("deg");
    units = false;
    unitsRad.style.color = "black";
    unitsDeg.style.color = "#a0a0a0";
    return;
}

//Смена единицы измерения на градусы
function switchOnDeg() {
    let unitsRad = document.getElementById("rad");
    let unitsDeg = document.getElementById("deg");
    units = true;
    unitsDeg.style.color = "black";
    unitsRad.style.color = "#a0a0a0";
    return;
}

//Переключения поля кнопок
function buttonFieldChange() {
    const buttonFieldOne = document.getElementById('buttons-field-one');
    const buttonFieldTwo = document.getElementById('buttons-field-two');
    const calculator = document.getElementById('calculator');
    if (buttonFieldOne.style.display === "none") {
        buttonFieldOne.style.display = "grid";
        buttonFieldTwo.style.display = "none";
        calculator.style.height = "464px";
    }
    else {
        buttonFieldOne.style.display = "none";
        buttonFieldTwo.style.display = "grid";
        calculator.style.height = "394px";
    }
}

//Удаление лишних нулей
function removeExtraZeros(number) {
    if (number[number.length - 1] === "0") {
        number = number.slice(0, -1);
        if (number[number.length - 1] === "0") {
            number = number.slice(0, -1);
            number = number.slice(0, -1);
            if (number === "") number = "0";
        }
    }
    return number;
}

//Количество цифр в строке
function numberCountString (str) {
    str = String(str);
    let n = str.match( /\d/g );
    n = n ? n = n.length : 0;
    return n;
}

//Проверка на максимально допустимое количество цифр в поле вывода
function checkAllowedNumber(number, maxCountNumbers, func) {
    if (number.indexOf(".") !== -1) {
        if (numberCountString(number) > maxCountNumbers + 1 || number[maxCountNumbers] === ".") {
            if (func) {
                return removeExtraZeros(Number(number).toFixed(2));
            }
            else if (String(number).indexOf("e") !== -1) {
                return Number(number).toExponential(7);
            }
            else {
                if (func) {
                    return removeExtraZeros(Number(number).toFixed(2));
                }
                 else if (result !== "") {
                    let number_ = removeExtraZeros(Number(number).toFixed(2));
                    if (numberCountString(number_) > maxCountNumbers) {
                        return Number(number).toExponential(7);
                    }
                    else return number_;
                }
                else {
                    if (numberCountString(number) > maxCountNumbers) {
                        return Number(number).toExponential(7);
                    }
                }
            }
        }
    }
    else if (numberCountString(number) > maxCountNumbers) {
        return Number(number).toExponential(7);
    }
    return number;
}

//Преобразование числа для вывода
function outputNumber(number, func = false) {
    number = String(number);
    if (number === "") {
        number = "0";
    }
    if (number[0] === ".") {
        let data = number.substr(1, number.length - 1);
        number = "0." + data;
    }
    if (number[0] === "-" && number.length === 1) {
        number = "-0";
    }
    if (number[0] === "-" && number[1] === ".") {
        let data = number.substr(2, number.length - 1);
        number = "-0." + data;
    }
    if (number.length !== 1 && number[number.length - 1] === ".") {
        number = number + "0";
    }
    if (number[0] === "e") {
        number = "0" + number;
    }
    if (number[number.length - 1] === "+" || number[number.length - 1] === "-" &&
        number[number.length - 2] === "e") {
        number = number + "0";
    }
    if (number[0] === "-") {
        return checkAllowedNumber(number, 9, func);
    }
    else {
        return checkAllowedNumber(number, 8, func);
    }
}

//Ввод чисел
function inputNumbers(element) {
    if (result !== "") {
        result = "";
        if (leftOperand !== "-") {
            leftOperand = "";
        }
        backward.innerHTML = " ";
        expression.innerHTML = "0";
    }
    if (element.textContent === "." &&
        expression.innerHTML.indexOf(".") !== -1) return;

    if (expNumInp) { //Если идёт ввод экспоненциального числа
        if (element.textContent === ".") return;
        if (order.length > 1) return;
        else {
            order += element.textContent;
            if (sign === "") {
                leftOperand += element.textContent;
                expression.innerHTML = outputNumber(leftOperand);
            }
            else {
                rightOperand += element.textContent;
                expression.innerHTML = outputNumber(rightOperand);
            }
        }
    }
    else { //Иначе ввод операндов
        if (sign === "") {
            leftOperand += element.textContent;
            expression.innerHTML = outputNumber(leftOperand);
        }
        else {
            rightOperand += element.textContent;
            expression.innerHTML = outputNumber(rightOperand);
        }
    }
    status();
}

//Ввод знака
function inputSign(element) {
    if (result !== "") {
        leftOperand = result;
        result = "";
    }

    if (expNumInp) {
        expNumInp = false;
        order = "";
        if (sign === "") {
            leftOperand = outputNumber(leftOperand);
        }
        else {
            rightOperand = outputNumber(rightOperand);
        }
    }

    let sign_;
    if (element.textContent === "xy") {
        sign_ = "^";
    }
    else {
        sign_ = element.textContent;
    }
    if (sign === "" && leftOperand !== "") {
        sign = sign_;
        backward.innerHTML = outputNumber(leftOperand) + " " + sign;
        expression.innerHTML = "0";
    }
    else if (leftOperand === "" && sign === "" && rightOperand === "" && result !== "") {
        leftOperand = result;
        sign = sign_;
        backward.innerHTML = outputNumber(leftOperand) + " " + sign;
        expression.innerHTML = "0";
        result = "";
    }
    else if (sign === "" && leftOperand === "" && sign_ === "-") {
        leftOperand += "-";
        expression.innerHTML = outputNumber(leftOperand);
    }
    else if (sign !== "" && rightOperand === "" && sign_ === "-") {
        rightOperand += "-";
        expression.innerHTML = outputNumber(rightOperand);
    }
    else if (leftOperand !== "" && sign !== "" && rightOperand !== "") {
        equals();
        leftOperand = result;
        result = "";
        sign = sign = sign_;
        backward.innerHTML = outputNumber(leftOperand) + " " + sign;
        expression.innerHTML = "0";
    }
    status();
}

//Посчитать выражение
function calculate() {
    if (leftOperand !== "" && sign ==="" && rightOperand === "" && String(leftOperand).indexOf("e") && order !== "") {
        let mantissa = String(leftOperand).split("e")[0];
        result = mantissa * Math.pow(10, order);
    }
    if (leftOperand !== "" && sign !== "" && rightOperand !== "") {
        leftOperand = Number(leftOperand);
        rightOperand = Number(rightOperand);
        if (sign === "/") {
            result = leftOperand / rightOperand;
        }
        else if (sign === "*") {
            result = leftOperand * rightOperand;
        }
        else if (sign === "-") {
            result = leftOperand - rightOperand;
        }
        else if (sign === "+") {
            result = leftOperand + rightOperand;
        }
        else if (sign === "^") {
            result = Math.pow(leftOperand, rightOperand);
        }
    }
    status();
}

//Посчитать посчитанное число
function equals() {
    calculate();
    backward.innerHTML = " ";
    expression.innerHTML = outputNumber(result);
    leftOperand = result;
    rightOperand = "";
    sign = "";
    expNumInp = false;
    order = "";
    status();
}

//Ввод числа в экспоненциальной форме
function exponentialNumberInput() {
    if (sign === "") {
        if (leftOperand === "") return;
        if (String(leftOperand).indexOf("+") !== -1 ||
            String(leftOperand).indexOf("-") !== -1 &&
            String(leftOperand).indexOf("e") !== -1) return;
        else {
            leftOperand += "e+";
            expression.innerHTML = outputNumber(leftOperand);
        }
    }
    else {
        if (rightOperand === "") return;
        if (String(rightOperand).indexOf("+") !== -1 ||
            String(rightOperand).indexOf("-") !== -1 &&
            String(rightOperand).indexOf("e") !== -1) return;
        else {
            rightOperand += "e+";
            expression.innerHTML = outputNumber(rightOperand);
        }
    }
    expNumInp = true;
}

//Очистить всё
function allClear() {
    backward.innerHTML = " ";
    expression.innerHTML = "0";

    //Переменные для обычного счета
    leftOperand = "";
    sign = "";
    rightOperand = "";
    result = "";
    order = "";
    expNumInp = false;

    status();
}

//Удалить последний введный символ
function deleteLastCharacter() {
    if (result !== "") {
        leftOperand = outputNumber(result);
        result = "";
    }


    if (expNumInp) { //Если идёт ввод экспоненциального числа
        if (order !== "") {
            order = order.slice(0, -1);
            if (sign === "") {
                leftOperand = leftOperand.slice(0, -1);
                expression.innerHTML = outputNumber(leftOperand);
            }
            else {
                rightOperand = rightOperand.slice(0, -1);
                expression.innerHTML = outputNumber(rightOperand);
            }
        }
    }
    else {
        if (sign === "") {
            let num = outputNumber(leftOperand);
            if (String(leftOperand).length > String(num).length) {
                leftOperand = num;
            }
            leftOperand = String(leftOperand).slice(0, -1);
            expression.innerHTML = outputNumber(leftOperand);
        }
        else {
            let num = outputNumber(leftOperand);
            if (String(rightOperand).length > String(num).length) {
                rightOperand = num;
            }
            rightOperand = String(rightOperand).slice(0, -1);
            expression.innerHTML = outputNumber(rightOperand);
        }
    }
    status();
}

//Смена знака
function plusMinus() {
    if (result !== "") {
        leftOperand = result;
        result = "";
    }

    if (expNumInp) {
        let correctedNumberOnScreen = String(expression.innerHTML);
        if (order >= 0) {
            correctedNumberOnScreen = correctedNumberOnScreen.replace("+", "-");
            if (sign === "") {
                leftOperand = leftOperand.replace("+", "-");
            }
            else {
                rightOperand = rightOperand.replace("+", "-");
            }
        }
        else {
            correctedNumberOnScreen = correctedNumberOnScreen.replace("-", "+");
        }
        expression.innerHTML = correctedNumberOnScreen;
        if (order !== "") {
            order = -order;
        }
    }
    else {
        if (sign === "") {
            if (leftOperand === "" || leftOperand === ".") return;
            leftOperand = -leftOperand;
            console.log("1");
            if (expression.innerHTML[0] === "-") {
                expression.innerHTML = expression.innerHTML.slice(1);
                console.log("2");
            } else {
                expression.innerHTML = "-" + expression.innerHTML;
                console.log("3");
            }
        }
        else {
            if (rightOperand === "" || rightOperand === ".") return;
            rightOperand = -rightOperand;
            if (expression.innerHTML[0] === "-") {
                expression.innerHTML = expression.innerHTML.slice(1);
            } else {
                expression.innerHTML = "-" + expression.innerHTML;
            }
        }
    }
    buttonFieldChange();
    status();
}

//Ввод функций
function inputSqrt() {
    if (sign === "") {
        leftOperand = Math.sqrt(leftOperand);
        expression.innerHTML = outputNumber(leftOperand, true);
    }
    else {
        rightOperand = Math.sqrt(rightOperand);
        expression.innerHTML = outputNumber(rightOperand, true);
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputLn() {
    if (sign === "") {
        leftOperand = Math.log(leftOperand);
        expression.innerHTML = outputNumber(leftOperand, true);
    }
    else {
        rightOperand = Math.log(rightOperand);
        expression.innerHTML = outputNumber(rightOperand, true);
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputLg() {
    if (sign === "") {
        leftOperand = Math.log10(leftOperand);
        expression.innerHTML = outputNumber(leftOperand, true);
    }
    else {
        rightOperand = Math.log10(rightOperand);
        expression.innerHTML = outputNumber(rightOperand, true);
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputSin() {
    if (!units) {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.sin(leftOperand);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.sin(rightOperand);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    else {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            let temp = leftOperand / 57.3;
            leftOperand = Math.sin(temp);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            let temp = rightOperand / 57.3;
            rightOperand = Math.sin(temp);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputCos() {
    if (!units) {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.cos(leftOperand);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.cos(rightOperand);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    else {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            let temp = leftOperand / 57.3;
            leftOperand = Math.cos(temp);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            let temp = rightOperand / 57.3;
            rightOperand = Math.cos(temp);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputTan() {
    if (!units) {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.tan(leftOperand);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.tan(rightOperand);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    else {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            let temp = leftOperand * Math.PI / 180;
            leftOperand = Math.tan(temp);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            let temp = rightOperand * Math.PI / 180;
            rightOperand = Math.tan(temp);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputAsin() {
    if (!units) {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.asin(leftOperand);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.asin(rightOperand);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    else {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.asin(leftOperand) / Math.PI * 180;
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.asin(rightOperand) / Math.PI * 180;
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputAcos() {
    if (!units) {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.acos(leftOperand);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.acos(rightOperand);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    else {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.acos(leftOperand) / Math.PI * 180;
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.acos(rightOperand) / Math.PI * 180;
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputAtan() {
    if (!units) {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.atan(leftOperand);
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.atan(rightOperand);
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    else {
        if (sign === "") {
            if (leftOperand === "") leftOperand = 0;
            leftOperand = Math.atan(leftOperand) / Math.PI * 180;
            leftOperand = outputNumber(leftOperand, true);
            expression.innerHTML = leftOperand;
        }
        else {
            if (rightOperand === "") rightOperand = 0;
            rightOperand = Math.atan(rightOperand) / Math.PI * 180;
            rightOperand = outputNumber(rightOperand, true);
            expression.innerHTML = rightOperand;
        }
    }
    buttonFieldChange();
    result = "";
    status();
}
function inputPi() {
    if (sign === "") {
        leftOperand = Math.PI.toFixed(7);
        expression.innerHTML = outputNumber(leftOperand, true);
    }
    else {
        rightOperand = Math.PI.toFixed(7);
        expression.innerHTML = outputNumber(rightOperand, true);
    }
    buttonFieldChange();
    result = "";
}
function inputE() {
    if (sign === "") {
        leftOperand = Math.E.toFixed(7);
        expression.innerHTML = outputNumber(leftOperand, true);
    }
    else {
        rightOperand = Math.E.toFixed(7);
        expression.innerHTML = outputNumber(rightOperand, true);
    }
    buttonFieldChange();
    result = "";
}
function inputExtentE() {
    if (sign === "") {
        leftOperand = Math.exp(leftOperand);
        expression.innerHTML = outputNumber(leftOperand, true);
    }
    else {
        rightOperand = Math.exp(rightOperand);
        expression.innerHTML = outputNumber(rightOperand, true);
    }
    buttonFieldChange();
    result = "";
    status();
}
