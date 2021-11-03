const mainContainer = $("#main");

//get input value from user
const handleSearch = (event) => {
  event.preventDefault();

  const searchInputs = getSearchInputs();

  localStorage.setItem("options", JSON.stringify(searchInputs));

  //change page location
  window.location.assign("../../menu.html");
};

//transform random recipe data
const constructRandomRecipeObject = (data) => {
  const callback = (each) => {
    return {
      id: each.id,
      image: each.image,
      title: each.title,
    };
  };
  return data.recipes.map(callback);
};

//construct random recipes cards
const constructRandomRecipeCards = (data) => {
  //construct each random recipe card
  const callback = (each) => {
    const randomRecipeCard = `<div class="high-rated-recipe">
      <figure class="image is-128x128">
        <img class="is-rounded" src=${each.image}>
        <h3>${each.title}</h3>
      </figure>
    </div>`;
    //append random recipe card to random recipes container
    $("#random-recipes-container").append(randomRecipeCard);
  };
  data.forEach(callback);
};

//on page load execute functions:
const handleLoad = () => {
  // render random recipes cards
  const randomRecipesData = constructRandomRecipeObject(mockRandomRecipesData);
  constructRandomRecipeCards(randomRecipesData);
  const onClick = (event) => {
    event.preventDefault();
    const searchInput = $("#search-input").val();
    constructAndAppendModal(searchOptions, searchInput);
    $("#advance-search").on("click", handleSearch);
  };
  $("#filter-toggle").on("click", onClick);

  // add a event listener submit to get the input value
  $("#search-form").on("submit", handleSearch);

  $(".navbar-logo").hover(hoverIn, hoverOut);
};

$(document).ready(handleLoad);

$(".info-icon").hover(
  function () {
    $(".nutrition-label").attr("class", "nutrition-label displayed");
  },
  function () {
    $(".nutrition-label").removeClass("displayed");
  }
);

// $("#filter-toggle").on("click", renderModal);

$(".close-modal").on("click", closeModal);
