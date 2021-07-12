const initialState = { favoritesFilm: [] }

function toggleFavorite(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            const favoriteFilmIndex = state.favoritesFilm.findIndex(
                (item) => item.id === action.value.id
            )
            // in case of presence in the array delete otherwise add:
            if (favoriteFilmIndex !== -1) {
                // supression
                nextState = {
                    ...state,
                    favoritesFilm: state.favoritesFilm.filter(
                        (item, index) => index !== favoriteFilmIndex
                    )
                }
            } else {
                // ajouter
                nextState = {
                    ...state,
                    // concatenate the existing movies with new films
                    favoritesFilm: [ ...state.favoritesFilm, action.value ]
                }
            }
            return nextState || state
        default:
            return state
    }
}

export default toggleFavorite
