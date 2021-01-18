const Database = require("./mongoose_model_games");
const fetch = require("node-fetch");

const getGameDatabase = async () => {
    const game_database = [];
    for (let i = 1; i < 10; i++) {  
      try {
        const apishot = await fetch(
          `https://api.rawg.io/api/games?page=${i}&page_size=40`
        );
        const data = await apishot.json();
        game_database.push(
          data.results.map(
            (game) =>
              (game = {
                id: game.id,
                reviews: game.reviews_count,
              })
          )
        );
      } catch (error) {
        console.log(error);
        return game_database;
      }
    }
    const result = game_database.flat(3).sort((a, b) => b.reviews - a.reviews);
    return result.length >= 360 ? getGameDatabaseDetails(result) : []
};

const getGameDatabaseDetails = async (database) => {
  const new_database = []
  for (let i = 0; i < database.length; i++) {
    try {
        const apishot = await fetch(`https://api.rawg.io/api/games/${database[i].id}`)
        const game_with_details = await apishot.json()
        const full_game_info = await getGameScreenshots(game_with_details)
        new_database.push(full_game_info)
    }
    catch(error) {
        console.log('getGameDetails')
        console.log(error)
        return {}
    }
  }
  const filtered_database = new_database.filter(game => game.hasOwnProperty('game_id')
    && game.hasOwnProperty('name')
    && game.hasOwnProperty('screenshots')
    && game.hasOwnProperty('answers')
    && game.hasOwnProperty('hints')
    && game
  )
  filtered_database.length > 330 && await Database.deleteMany({})
  Database.insertMany(filtered_database).then(console.log('Database updated'))
  return filtered_database
}

const getGameScreenshots = async (game_with_details) => {
  try {
      const apishot = await fetch(`https://api.rawg.io/api/games/${game_with_details.id}/screenshots`)
      const screenshots = await apishot.json()
      const game_screenshots = pick3randomsFromArray(screenshots.results).map(screen => screen = screen.image)
      const game_with_screenshots = {
          "game_id": game_with_details.id,
          "name": game_with_details.name,
          "screenshots": [...game_screenshots],
          "hints": [
              {"developer": game_with_details.developers[0].name || ""},
              {"released": game_with_details.released},
              {"genre": game_with_details.genres[game_with_details.genres.length-1].name},
          ],
      }
      return getSimilarGames(game_with_screenshots)
  }
  catch(error) {
      console.log(error)
      return {}
  }
}

const pick3randomsFromArray = (array) => {
  const source = [...array]
  const resultArray = []
  for (let i=0; i<3; i++) {
    const randomIndex = Math.floor(Math.random() * source.length)
    resultArray.push(source.splice(randomIndex, 1)[0])
  }
  return resultArray
}

const getSimilarGames = async (game_with_screenshots) => {
  try {
    const apishot = await fetch(`https://api.rawg.io/api/games/${game_with_screenshots.game_id}/suggested`)
    const suggested = await apishot.json()
    const answers = [...pick3randomsFromArray(suggested.results.map(game => game = game.name)), game_with_screenshots.name].sort()
    const game_with_data = {
        ...game_with_screenshots,
        answers: [ ...answers]
    }
    return game_with_data
  }
  catch(error) {
    console.log(error)
    return ["Error", "Error", "Error"]
  }
}

module.exports = getGameDatabase 