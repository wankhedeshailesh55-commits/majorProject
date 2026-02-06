let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});

let seeFilters = document.getElementById("see-filters");
seeFilters.addEventListener("click", () => {
  let filterGroup = document.getElementById("filter-group");
  if (filterGroup.style.display === "none") {
    filterGroup.style.display = "inline-flex";
    seeFilters.innerHTML =
      '<div><i class="fa-solid fa-angle-left"></i></div><p>See less</p>';
  } else {
    filterGroup.style.display = "none";
    seeFilters.innerHTML =
      '<div><i class="fa-solid fa-angle-right"></i></div><p>See more</p>';
  }
});

let seeFiltersLess = document.getElementById("see-filters-less");
seeFiltersLess.addEventListener("click", () => {
  let filterGroup = document.getElementById("filter-group");
  if (filterGroup.style.display === "inline-flex") {
    filterGroup.style.display = "none";
    seeFiltersLess.innerHTML =
      '<div><i class="fa-solid fa-angle-right"></i></div><p>See more</p>';
  } else {
    filterGroup.style.display = "inline-flex";
    seeFiltersLess.innerHTML =
      '<div><i class="fa-solid fa-angle-left"></i></div><p>See less</p>';
  }
});
