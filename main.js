const colorOne = document.querySelector(".js-color-1");
const colorTwo = document.querySelector(".js-color-2");
const colorThree = document.querySelector(".js-color-3");
const textInput = document.querySelector(".js-textInput");
const displayContainer = document.querySelector(".js-displayContainer");
const outputContainer = document.querySelector(".js-outputContainer");

function handleColorChange(e) {
  const colorInputContainer = e.currentTarget.closest(".color-input-container");
  if (colorInputContainer !== null) {
    colorInputContainer.style.background = e.currentTarget.value;
    gradText();
  }
}

function handleTextChange(e) {
  gradText();
}

function gradText() {
  const colorOneValue = colorOne.value;
  const colorTwoValue = colorTwo.value;
  const colorThreeValue = colorThree.value;
  const string = textInput.value || "Empty text";
  const whiteSpace = string.match(/\x20/g) ? string.match(/\x20/g).length : 0;

  displayContainer.innerHTML = "";
  outputContainer.innerHTML = "";

  for (let i = 0, skip = 0; i < string.length; i++) {
    if (string[i] == " ") {
      skip += 1;
      displayContainer.innerHTML += string[i];
      outputContainer.innerHTML += string[i];
    } else {
      let gradColor;
      if (i < string.length / 2) {
        gradColor = createColor(colorOneValue, colorTwoValue, colorTwoValue, (i - skip) / (string.length / 2 - whiteSpace - 1));
      } else {
        gradColor = createColor(colorTwoValue, colorTwoValue, colorThreeValue, (i - skip - string.length / 2) / (string.length / 2 - whiteSpace - 1));
      }
      
      displayContainer.innerHTML +=
        '<span style="color:' + gradColor + '">' + string[i] + "</span>";
      outputContainer.innerHTML +=
        '&lt;color="' + gradColor + '"&gt;' + string[i] + "&lt;/color&gt;";
    }
  }
}


function lerpColor(color1, color2, color3, ratio) {
  const color1Hex = parseInt(color1.substr(1), 16);
  const color2Hex = parseInt(color2.substr(1), 16);
  const color3Hex = parseInt(color3.substr(1), 16);
  
  const r = Math.floor(lerp(getRed(color1Hex), getRed(color2Hex), getRed(color3Hex), ratio));
  const g = Math.floor(lerp(getGreen(color1Hex), getGreen(color2Hex), getGreen(color3Hex), ratio));
  const b = Math.floor(lerp(getBlue(color1Hex), getBlue(color2Hex), getBlue(color3Hex), ratio));
  
  return rgbToHex(r, g, b);
}

function lerp(start, middle, end, t) {
  return start * (1 - t) * (1 - t) + middle * (1 - t) * t + end * t * t;
}

function getRed(hex) {
  return (hex >> 16) & 255;
}

function getGreen(hex) {
  return (hex >> 8) & 255;
}

function getBlue(hex) {
  return hex & 255;
}

function rgbToHex(r, g, b) {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function createColor(color1, color2, color3, ratio) {
  let endColor = "";
  color1 = color1.substring(1);
  color2 = color2.substring(1);
  color3 = color3.substring(1);
  const toHex = function (x) {
    x = x.toString(16);
    return x.length == 1 ? "0" + x : x;
  };
  for (let i = 0; i < color1.length; i += 2) {
    const calculated = Math.ceil(
      parseInt(color1.substring(i, i + 2), 16) * (1 - ratio) * (1 - ratio) +
        parseInt(color2.substring(i, i + 2), 16) * (1 - ratio) * ratio +
        parseInt(color3.substring(i, i + 2), 16) * ratio * ratio
    );
    endColor += toHex(calculated > 255 ? 255 : calculated);
  }
  return "#" + endColor;
}

window.addEventListener("load", function () {
  colorOne.closest(".color-input-container").style.background = colorOne.value;
  colorTwo.closest(".color-input-container").style.background = colorTwo.value;
  colorThree.closest(".color-input-container").style.background = colorThree.value;
  colorOne.addEventListener("change", handleColorChange);
  colorTwo.addEventListener("change", handleColorChange);
  colorThree.addEventListener("change", handleColorChange);
  textInput.addEventListener("input", handleTextChange);
  gradText();
});
