/*******************************************************
 * 1) Populate <select> elements
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
 * 2) Define paths for body parts
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
 * 3) Build avatar with <image> elements
 *******************************************************/
function createAvatarSvg(day, month, decade) {
  let eyeImage = "";
  let noseImage = "";
  let mouthImage = "";

  if (day && dayToEyePath[day]) {
    eyeImage = `<image href="${dayToEyePath[day]}" x="130" y="80" width="100" height="100"/>`;
  }

  if (month && monthToNosePath[month]) {
    noseImage = `<image href="${monthToNosePath[month]}" x="215" y="160" width="70" height="120"/>`;
  }

  if (decade && decadeToMouthPath[decade]) {
    mouthImage = `<image href="${decadeToMouthPath[decade]}" x="50" y="280" width="150" height="80"/>`;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
      ${eyeImage}
      ${noseImage}
      ${mouthImage}
    </svg>
  `;
}

/*******************************************************
 * 4) Refresh avatar when selections change
 *******************************************************/
function refreshAvatar() {
  const day = parseInt(document.getElementById("daySelect").value, 10);
  const month = parseInt(document.getElementById("monthSelect").value, 10);
  const decade = parseInt(document.getElementById("decadeSelect").value, 10);

  const combined = createAvatarSvg(day, month, decade);
  document.getElementById("finalAvatar").innerHTML = combined;

  const downloadBtn = document.getElementById("downloadButton");
  downloadBtn.style.display = day && month && decade ? "inline-block" : "none";
}

/*******************************************************
 * 5) Reset avatar
 *******************************************************/
function resetAvatar() {
  document.getElementById("daySelect").value = "";
  document.getElementById("monthSelect").value = "";
  document.getElementById("decadeSelect").value = "";
  document.getElementById("finalAvatar").innerHTML = "";
  document.getElementById("downloadButton").style.display = "none";
}

/*******************************************************
 * 6) Download avatar as SVG
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
 * 7) Download avatar as PNG
 *******************************************************/
function downloadPng() {
  const svgNode = document.getElementById("finalAvatar");
  domtoimage
    .toPng(svgNode, { width: 500, height: 500 })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "astro_avatar.png";
      link.click();
    })
    .catch((err) => {
      console.error("PNG generation failed!", err);
    });
}
