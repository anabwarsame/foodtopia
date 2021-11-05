//render image card
const renderImageRecipeCard = (data) => {
  //construct image card
  const imageRecipeCard = `<article class="tile is-child"> 
    <h1 class="has-text-centered title recipe-card-title">${data.title}</h1>
    <figure class="image is-4by3">
    <img
      class="recipe-img"
      src=${data.image}
      alt=${data.title}
    />
    <div class=" recipe-icon-container">
      <button id=${data.id} class="recipe-icon">
        <i id=${data.id} class="mb-3 fas fa-heart fa-lg"></i>
      </button>
      <button class="recipe-icon recipe-info-icon">
        <i class="mb-3 fas fa-info fa-lg"></i>
      </button>
    </div>
    </figure>
    <div class="nutrition-label">
    <div class="column nutrient-col">
      <h6>Energy</h6>
      <p>${data.energy}</p>
    </div>
    <div class="column nutrient-col">
      <h6>Fat</h6>
      <p>${data.fat}${data.fatUnit}</p>
      <span>${data.fatPerDay}</span>
    </div>
    <div class="column nutrient-col">
      <h6>Saturates</h6>
      <p>${data.saturates}${data.saturatesUnit}</p>
      <span>${data.saturatesPerDay}</span>
    </div>
    <div class="column nutrient-col">
      <h6>Sugars</h6>
      <p>${data.sugars}${data.sugarsUnit}</p>
      <span>${data.sugarsPerDay}</span>
    </div>
    <div class="column">
      <h6>Salt</h6>
      <p>${data.salt}${data.saltUnit}</p>
      <span>${data.saltPerDay}</span>
    </div>
    </div> 
    <footer class="card-footer recipe-info-container">
    
    <div class="card-footer-item  recipe-info-box">
      <p>COOK</p>
      <h2 class="prep-time-heading">${data.time}</h2>
    </div>
    <div class="card-footer-item recipe-info-box">
      <p>SERVES</p>
      <h2 class="prep-time-heading">${data.serves}</h2>
    </div>
    
    <div class="card-footer-item recipe-info-box">
      <p>DIFFICULTY</p>
      <h2 class="prep-time-heading">${getCostRange(data)}</i></h2>
    </div>
    <div class="card-footer-item recipe-info-box">
      <p>COST</p>
      <h2 class="prep-time-heading">${getPopularityScore(data)}</i></h2>
    </div>
    </footer> 
      </article>
      <article class="desc-container description-container">
        <h2 class="title">Wine pairing</h2>
        <p class="subtitle">${data.summary}</p>
      </article>`;

  getCostRange(data);

  //append image card and nutritional info on icon hover
  $("#image-recipe-container").append(imageRecipeCard);

  const addToFavourites = (event) => {
    console.log("hello");
    // Get the snackbar DIV
    var toast = $("#toast");

    // Add the "show" class to DIV
    toast.addClass("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      toast.attr("class", "");
    }, 3000);

    const target = event.target;

    if ($(target).attr("id") == data.id) {
      const favouritesRecipe = {
        id: each.id,
        title: each.title,
        time: each.readyInMinutes,
        servings: each.servings,
        image: each.image,
        calories: each.calories,
      };

      const favourites = getFromLocalStorage("favourites", []);

      const findRecipeId = (each) => {
        return each.id == $(target).attr("id");
      };

      const isRecipeInFavourites = favourites.find(findRecipeId);

      if (!isRecipeInFavourites) {
        favourites.push(favouritesRecipe);

        localStorage.setItem("favourites", JSON.stringify(favourites));
      }
    }
  };

  //add to local storage
  $(".recipe-icon").on("click", addToFavourites);

  $(".info-icon").hover(
    function () {
      $(".nutrition-label").attr("class", "nutrition-label displayed");
    },
    function () {
      $(".nutrition-label").removeClass("displayed");
    }
  );
};

//get cost range
const getCostRange = (data) => {
  if (data.cheap) {
    return "cheap";
  } else {
    return "admirable";
  }
};

//get popularity score
const getPopularityScore = (data) => {
  if (data.veryPopular) {
    return "high";
  } else {
    return "low";
  }
};

// add a function to construct API URL
const constructApiUrl = (searchQuery) => {
  let recipeId = searchQuery;

  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`;
  return url;
};

//render cooking methods card
const renderCookingMethodCard = (data) => {
  //construct cooking methods card
  const cookingMethodsCard = $(`<article class="tile is-child method-container">
  <h2 class="title">Method</h2>
  <p class="subtitle">Method of cooking/steps</p>
  </article>`);

  //construct each cooking method container
  const constructEachCookingMethod = (each) => {
    const cookingMethod = `<div class="content">${each.stepNumber}. ${each.stepInstruction}</div>`;
    $(cookingMethod).appendTo(cookingMethodsCard);
  };

  data.forEach(constructEachCookingMethod);
  //append cooking method card to cooking method container
  $("#method-container").append(cookingMethodsCard);
};

const renderServingQuantities = function (userServings) {
  $("#original-serving-div").append(
    `<div><div class="my-1 servings-btn">${userServings.servings}<div/></div>`
  );
  $("#original-serving-div").data("value", userServings.servings);
  $("#original-serving").data("value", userServings.servings);
};

// ingredients calculator
const ingredientsCalculator = (servingData, ingredientsData, userServings) => {
  const servings = servingData.serves;
  const ingredientsCalculatorItem = (each) => {
    // console.log(each);
    // get value from each ingredient
    const value = each.quantity;
    // divide value by number of servings with the recipe
    const baseServing = value / servings;
    const selectedServings = Math.floor(baseServing * userServings);
    // console.log(each.ingredientName, selectedServings);

    const ingredientItem = `<div>
      <span>${selectedServings}</span>
      ${each.quantityUnit} ${each.ingredientName}
      </div>`;

    $("#ingredients-container").append(ingredientItem);
    // get number of servings user wishes to use
    // times the new value with teh number of servings
    // render new value
  };
  $("#ingredients-container").empty();
  ingredientsData.forEach(ingredientsCalculatorItem);
};

//render ingredients card
const renderIngredientsCard = (data) => {
  const constructIngredientItem = (each) => {
    const ingredientItem = `<div>
    <span>${each.quantity}</span>
    ${each.quantityUnit} ${each.ingredientName}
    </div>`;
    $("#ingredients-container").append(ingredientItem);
  };
  data.forEach(constructIngredientItem);
};

//render youtube videos
const renderYouTubeVideos = (data) => {
  const callback = (each) => {
    const videoCard = `<div class="mb-3">
    <iframe
      width="100%"
      height="auto"
      src="https://youtube.com/embed/${each.videoId}"
      allowfullscreen
    ></iframe>
  </div>`;
    // $("#video-container").append(videoCard);
  };

  data?.forEach(callback);
};

//get nutrient key name from nutrients array
const getNutrient = (arr, key) => {
  return arr.find((each) => {
    return each.name === key;
  });
};

//transform recipe info data from API
const constructRecipeObject = (data) => {
  const nutrients = data?.nutrition?.nutrients || [];
  const energy = getNutrient(nutrients, "Calories");
  const fat = getNutrient(nutrients, "Fat");
  const saturates = getNutrient(nutrients, "Saturated Fat");
  const sugars = getNutrient(nutrients, "Sugar");
  const salt = getNutrient(nutrients, "Sodium");

  return {
    image: data.image,
    title: data.title,
    time: data.readyInMinutes,
    serves: data.servings,
    summary: data.winePairing.pairingText || "No wine pairings were found",

    //calories
    energy: energy?.amount || "N/A",

    //fats
    fat: fat?.amount || "N/A",
    fatPerDay: fat?.percentOfDailyNeeds || "N/A",
    fatUnit: fat?.unit,

    //saturated fats
    saturates: saturates?.amount || "N/A",
    saturatesPerDay: saturates?.percentOfDailyNeeds || "N/A",
    saturatesUnit: saturates?.unit,

    //sugar
    sugars: sugars?.amount || "N/A",
    sugarsPerDay: sugars?.percentOfDailyNeeds || "N/A",
    sugarsUnit: sugars?.unit,

    //salt
    salt: salt?.amount || "N/A",
    saltPerDay: salt?.percentOfDailyNeeds || "N/A",
    saltUnit: salt?.unit,
  };
};

//transform cooking method data from the API
const constructCookingMethodObject = (data) => {
  const callback = (each) => {
    return {
      stepNumber: each.number,
      stepInstruction: each.step,
    };
  };
  return data.analyzedInstructions[0].steps.map(callback);
};

//transform ingredients data from the API
const constructIngredientsObject = (data) => {
  const callback = (each) => {
    return {
      ingredientName: each.name,
      quantity: each.measures.metric.amount,
      quantityUnit: each.measures.metric.unitShort,
    };
  };
  return data.extendedIngredients.map(callback);
};

//transform video data fro YT API
const constructVideosObject = (data) => {
  const callback = (each) => {
    return {
      videoId: each.id.videoId,
      // title: each.snippet.title,
      // thumbnail: each.snippet.thumbnails.default.url,
    };
  };
  return data?.items?.map(callback);
};

const onLoad = async () => {
  //get recipe id from local storage
  const recipeIdValue = getFromLocalStorage("recipeId", {});

  if (recipeIdValue) {
    //build url API
    const apiUrl = `https://api.spoonacular.com/recipes/${recipeIdValue}/information?includeNutrition=true&apiKey=${API_KEY}`;

    //fetch recipe information data
    const recipeData = await getApiData(apiUrl);

    //get recipe info and render recipe image card
    const recipeInformationData = constructRecipeObject(recipeData);
    renderImageRecipeCard(recipeInformationData);

    //get cooking methods info and render cooking method card
    const cookingMethodsData = constructCookingMethodObject(recipeData);
    renderCookingMethodCard(cookingMethodsData);

    //get ingredients info and render ingredients list
    const ingredientsData = constructIngredientsObject(recipeData);
    renderIngredientsCard(ingredientsData);

    const getUserServings = (event) => {
      const target = event.target;
      if ($(target).hasClass("servings-value")) {
        const servingTabValue = $(target).data("value");
        console.log(servingTabValue);

        ingredientsCalculator(
          recipeInformationData,
          ingredientsData,
          servingTabValue
        );
      }
    };

    $("#servings-container").on("click", getUserServings);

    renderServingQuantities(recipeData);
    //get recipe title, which will be used as parameter for YouTube api call; remove blank space between words
    const recipeTitle = recipeInformationData.title.split(" ").join("");

    //build youtube api url
    const youTubeApiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${recipeTitle}&key=${API_KEY_YOU_TUBE}&maxResults=3`;

    //fetch youtube video information
    const videoDataRecipe = await getApiData(youTubeApiUrl);

    //get recipe video data and render video cards
    const videosData = constructVideosObject(videoDataRecipe);
    renderYouTubeVideos(videosData);
  }
};

$(document).ready(onLoad);
