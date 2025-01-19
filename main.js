/*******************************************************
 * 1) Populate <select> elements
 *******************************************************/
function populateSelectBoxes() {
  // DAY 1..31
  const daySelect = document.getElementById("daySelect");
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d; // numeric
    daySelect.appendChild(opt);
  }

  // MONTH 1..12
  const monthSelect = document.getElementById("monthSelect");
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m; // numeric
    monthSelect.appendChild(opt);
  }

  // DECADE 1900..2020 (step 10)
  const decadeSelect = document.getElementById("decadeSelect");
  for (let decade = 1900; decade <= 2020; decade += 10) {
    const opt = document.createElement("option");
    opt.value = decade;
    opt.textContent = decade; // numeric
    decadeSelect.appendChild(opt);
  }
}

document.addEventListener("DOMContentLoaded", populateSelectBoxes);

/*******************************************************
 * 2) Global variables to store JSON data
 *******************************************************/
let dayToEyeSvg = {};
let monthToNoseSvg = {};
let decadeToMouthSvg = {};

/*******************************************************
 * 3) Fetch JSON files on page load
 *******************************************************/
Promise.all([
  fetch("eyes.json").then((r) => r.json()),
  fetch("nose.json").then((r) => r.json()),
  fetch("mouth.json").then((r) => r.json()),
])
  .then(([eyesData, noseData, mouthData]) => {
    dayToEyeSvg = eyesData;
    monthToNoseSvg = noseData;
    decadeToMouthSvg = mouthData;
    console.log("JSON files loaded.");
  })
  .catch((err) => {
    console.error("Error loading JSON files:", err);
  });

/*******************************************************
 * 4) Build the final avatar SVG snippet
 *******************************************************/
function createAvatarSvg(day, month, decade) {
  let eyeSvg = "";
  let noseSvg = "";
  let mouthSvg = "";

  if (day && dayToEyeSvg[day]) {
    eyeSvg = `
      <g transform="translate(130, 80) scale(0.5)">
        ${dayToEyeSvg[day]}
      </g>
    `;
  }

  if (month && monthToNoseSvg[month]) {
    noseSvg = `
      <g transform="translate(215, 160) scale(0.4)">
        ${monthToNoseSvg[month]}
      </g>
    `;
  }

  if (decade) {
    if (decadeToMouthSvg[decade]) {
      mouthSvg = `
        <g transform="translate(50, 280) scale(0.5)">
          ${decadeToMouthSvg[decade]}
        </g>
      `;
    }
  }

  return `
    ${eyeSvg}
    ${noseSvg}
    ${mouthSvg}
  `;
}

/*******************************************************
 * 5) Refresh avatar + show/hide Download button
 *******************************************************/
function refreshAvatar() {
  const day = parseInt(document.getElementById("daySelect").value, 10);
  const month = parseInt(document.getElementById("monthSelect").value, 10);
  const decade = parseInt(document.getElementById("decadeSelect").value, 10);

  const combined = createAvatarSvg(day, month, decade);
  document.getElementById("finalAvatar").innerHTML = combined;

  // Show "Download" only if all 3 are selected
  const downloadBtn = document.getElementById("downloadButton");
  if (day && month && decade) {
    downloadBtn.style.display = "inline-block";
  } else {
    downloadBtn.style.display = "none";
  }
}

/*******************************************************
 * 6) Reset the avatar
 *******************************************************/
function resetAvatar() {
  document.getElementById("daySelect").value = "";
  document.getElementById("monthSelect").value = "";
  document.getElementById("decadeSelect").value = "";

  document.getElementById("finalAvatar").innerHTML = "";

  // Also hide the Download button again
  document.getElementById("downloadButton").style.display = "none";
}

/*******************************************************
 * 7) Download as SVG
 *******************************************************/
function downloadSvg() {
  const svgEl = document.getElementById("finalAvatar");
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);

  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "birthday_avatar.svg";
  link.click();
  URL.revokeObjectURL(url);
}

/*******************************************************
 * (Optional) Download as PNG via dom-to-image
 *******************************************************/
function downloadPng() {
  const svgNode = document.getElementById("finalAvatar");
  domtoimage
    .toPng(svgNode, { width: 500, height: 500 })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "birthday_avatar.png";
      link.click();
    })
    .catch((err) => {
      console.error("PNG generation failed!", err);
    });
}
