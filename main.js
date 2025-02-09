/*******************************************************
 * Populate <select> elements
 *******************************************************/
function populateSelectBoxes() {
  const daySelect = document.getElementById("daySelect");
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    daySelect.appendChild(opt);
  }

  const monthSelect = document.getElementById("monthSelect");
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    monthSelect.appendChild(opt);
  }

  const decadeSelect = document.getElementById("decadeSelect");
  for (let decade = 1900; decade <= 2020; decade += 10) {
    const opt = document.createElement("option");
    opt.value = decade;
    opt.textContent = decade;
    decadeSelect.appendChild(opt);
  }
}

document.addEventListener("DOMContentLoaded", populateSelectBoxes);

/*******************************************************
 * Define paths for body parts
 *******************************************************/
let dayToEyePath = {};
let monthToNosePath = {};
let decadeToMouthPath = {};

function initializePaths() {
  for (let d = 1; d <= 31; d++) {
    dayToEyePath[d] = `svgs/eyes/${d}.svg`;
  }

  for (let m = 1; m <= 12; m++) {
    monthToNosePath[m] = `svgs/nose/${m}.svg`;
  }

  for (let decade = 1900; decade <= 2020; decade += 10) {
    decadeToMouthPath[decade] = `svgs/mouth/${decade}.svg`;
  }
}

document.addEventListener("DOMContentLoaded", initializePaths);

/*******************************************************
 * Build avatar with direct SVG injection
 *******************************************************/
function createAvatarSvg(day, month, decade) {
  let leftEye = "";
  let rightEye = "";
  let nose = "";
  let mouth = "";

  if (day && dayToEyePath[day]) {
    leftEye = `<image href="${dayToEyePath[day]}" x="41" y="44" width="42" height="42"/>`;
    rightEye = `<image href="${dayToEyePath[day]}" x="118" y="44" width="42" height="42"/>`;
  }

  if (month && monthToNosePath[month]) {
    nose = `<image href="${monthToNosePath[month]}" x="99" y="93" width="12.625" height="37.625"/>`;
  }

  if (decade && decadeToMouthPath[decade]) {
    mouth = `<image href="${decadeToMouthPath[decade]}" x="62" y="144" width="75.5" height="38"/>`;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      ${leftEye}
      ${rightEye}
      ${nose}
      ${mouth}
    </svg>
  `;
}

/*******************************************************
 * Refresh avatar when selections change
 *******************************************************/
function refreshAvatar() {
  const day = parseInt(document.getElementById("daySelect").value, 10);
  const month = parseInt(document.getElementById("monthSelect").value, 10);
  const decade = parseInt(document.getElementById("decadeSelect").value, 10);

  const combined = createAvatarSvg(day, month, decade);
  document.getElementById("finalAvatar").innerHTML = combined;

  const showDownload = day && month && decade;
  document.getElementById("downloadSvgButton").style.display = showDownload
    ? "inline-block"
    : "none";
  document.getElementById("downloadPngButton").style.display = showDownload
    ? "inline-block"
    : "none";
}

/*******************************************************
 * Reset avatar
 *******************************************************/
function resetAvatar() {
  document.getElementById("daySelect").value = "";
  document.getElementById("monthSelect").value = "";
  document.getElementById("decadeSelect").value = "";
  document.getElementById("finalAvatar").innerHTML = "";
  document.getElementById("downloadSvgButton").style.display = "none";
  document.getElementById("downloadPngButton").style.display = "none";
}

/*******************************************************
 * Download avatar as SVG
 *******************************************************/
function downloadSvg() {
  const svgEl = document.getElementById("finalAvatar");
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);

  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "astro_avatar.svg";
  link.click();
  URL.revokeObjectURL(url);
}

/*******************************************************
 * Download avatar as PNG
 *******************************************************/
function downloadPng() {
  const svgEl = document.getElementById("finalAvatar");

  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");

  const svgData = new XMLSerializer().serializeToString(svgEl);
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "astro_avatar.png";
    link.click();
  };

  img.src = url;
}
