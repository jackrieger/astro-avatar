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
    leftEye = `<image id="leftEye" href="${dayToEyePath[day]}" x="41" y="44" width="42" height="42"/>`;
    rightEye = `<image id="rightEye" href="${dayToEyePath[day]}" x="118" y="44" width="42" height="42"/>`;
  }
  if (month && monthToNosePath[month]) {
    nose = `<image id="nose" href="${monthToNosePath[month]}" x="99" y="93" width="12.625" height="37.625"/>`;
  }
  if (decade && decadeToMouthPath[decade]) {
    mouth = `<image id="mouth" href="${decadeToMouthPath[decade]}" x="62" y="144" width="75.5" height="38"/>`;
  }

  // Draw all elements inside a 200x200 coordinate system.
  return `
    <svg id="avatarSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="none">
      <rect id="faceBackground" x="0" y="0" width="200" height="200" fill="white"/>
      ${leftEye} ${rightEye} ${nose} ${mouth}
    </svg>`;
}

/*******************************************************
 * Refresh avatar when selections change
 *******************************************************/
function refreshAvatar() {
  const day = parseInt(document.getElementById("daySelect").value, 10);
  const month = parseInt(document.getElementById("monthSelect").value, 10);
  const decade = parseInt(document.getElementById("decadeSelect").value, 10);

  // Set the inner HTML of finalAvatar to the generated SVG.
  document.getElementById("finalAvatar").innerHTML = createAvatarSvg(
    day,
    month,
    decade
  );

  const showDownload = day && month && decade;
  document.getElementById("downloadSvgButton").style.display = showDownload
    ? "inline-block"
    : "none";

  // No extra JS scaling is needed—the browser will stretch the entire SVG.
}

// Reset avatar
function resetAvatar() {
  document.getElementById("daySelect").value = "";
  document.getElementById("monthSelect").value = "";
  document.getElementById("decadeSelect").value = "";
  document.getElementById("finalAvatar").innerHTML = "";
  document.getElementById("downloadSvgButton").style.display = "none";
}

/*******************************************************
 * Download avatar as SVG (Embed external images)
 *******************************************************/
function downloadSvg() {
  // Clone the internal SVG (which is already stretched by the container)
  const svgEl = document
    .getElementById("finalAvatar")
    .querySelector("#avatarSvg")
    .cloneNode(true);

  // Set its width/height to the current container dimensions
  svgEl.setAttribute("width", window.innerWidth * 0.9);
  svgEl.setAttribute("height", window.innerHeight * 0.9);
  svgEl.setAttribute("preserveAspectRatio", "none");

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
