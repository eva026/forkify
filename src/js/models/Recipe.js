import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.author = res.data.recipe.publisher;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert('Something went wrong...');
    }
  }

  calcTime() {
    // Assume that every 3 ingredient needs 15 mins
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      'ounces',
      'ounce',
      'cups',
      'tablespoons',
      'tablespoon',
      'teaspoons',
      'teaspoon',
      'pounds',
    ];
    const unitsShort = [
      'oz',
      'oz',
      'cup',
      'tbsp',
      'tbsp',
      'tsp',
      'tsp',
      'pound',
    ];
    const units = [...unitsShort, 'kg', 'g'];
    const newIngredients = this.ingredients.map((el) => {
      // 1.Uniform the ingredients to lowercase
      let ingredient = el.toLowerCase();
      // 2.Replace unitLong with unitsShort
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 3.Remove text between parentheses and parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      // 4.Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // There is an unit index
        const arrCount = arrIng.slice(0, unitIndex);
        let count;

        if (arrCount.length === 1) {
          // Ex: [1-1/2], [1]
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          // Ex: [1, 3], typeOf eval() is a number
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There isn't a unit index, but there is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        // There isn't a unit index or a number in 1st place
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        };
      }
      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Update servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    // Update ingredients count
    this.ingredients.forEach((ing) => {
      ing.count = ing.count * (newServings / this.servings);
    });
    this.servings = newServings;
  }
}
