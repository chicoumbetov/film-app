import React from 'react'
import {StyleSheet, View, TextInput, Button, FlatList, ActivityIndicator} from 'react-native'
// import { films } from '../Helpers/filmsData.js'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from "../API/TMDBApi";

class Search extends React.Component {

    constructor(props) {
        super(props);
        // la page courante
        this.page = 0
        // nombre de pages totales pour savoir
        // si on a atteint la fin des retours de l'API TDMB
        this.totalPages = 0

        this.state = {
            films: [],
            isLoading: false
        }
        // Initialisation de notre donnée searchedText en dehors du state
        this.searchedText = ""
    }

    // Seulement si le texte recherché n'est pas vide
    _loadFilms() {
        if (this.searchedText.length > 0) {
            this.setState({isLoading: true})
            // +1 to call next page, otherwise we'll call always same page
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1)
                .then(data => {
                    this.page = data.page
                    this.totalPages = data.total_pages
                    this.setState({
                        // 1 copie of films array already taken
                        // 1 copie of new film lists array taken when searched
                        // then we put them in one array concatenanted
                        films: [ ...this.state.films, ...data.results], // ES6
                        // old version : films: this.state.films.concat(data.results),
                        isLoading: false
                    })
                    }
                )
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
    }

    _searchTextInputChanged(text) {
        // Modification du texte recherché à chaque saisie de texte,
        // sans passer par le setState comme avant
        this.searchedText = text
    }

    // pour différencier une recherche de films de l'appel d'une nouvelle page
    _searchFilms() {
        // on remettra à 0 notre state
        this.page = 0
        this.totalPages = 0
        this.setState({
            // plus spécifiquement, on remettra à zéro les films de notre state, juste avant d'appeler l'API
            films: []
        },
             //setState  possède un paramètre  callback  qui permet d'exécuter une action dès que notre state a fini de se mettre à jour
            // d'abord remettre le state et mes films à zéro, puis lancer une nouvelle recherche
            () => {
                // J'utilise la paramètre length sur mon tableau de films pour vérifier qu'il y a bien 0 film
                console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
                this._loadFilms()
            }
            )
    }

    // go to FilmDetail component(page) and pass id of chosen id
    _displayDetailForFilm = (idFilm) => {
        // check if we get id from clicked movie
        console.log('_displayDetailForFilm', idFilm)
        this.props.navigation.navigate('FilmDetail', {idFilm: idFilm})
    }

    render() {
        console.log("Search", this.props)
        return (
            <View style={styles.main_container}>
                <TextInput
                    placeholder='Titre du film'
                    onChangeText={(text) => this._searchTextInputChanged(text)}
                    style={styles.textinput}
                    // also possible to validate by pressing 'enter'
                    // as well as clicking on button
                    onSubmitEditing={() => this._searchFilms()}
                />
                <Button title='Rechercher' onPress={() => this._searchFilms()}/>
                {/* Ici j'ai simplement repris l'exemple sur la documentation de la FlatList */}
                <FlatList
                    data={this.state.films}
                    keyExtractor={item => item.key}
                    renderItem={
                        ({item}) => <FilmItem
                                       film={item}
                                       displayDetailForFilm={() => this._displayDetailForFilm(item.id)}
                                    />

                    }
                    // detection half screen before the end of list
                    /**
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (this.page < this.totalPages) {
                            this._loadFilms()
                            // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages)
                            // avant de charger plus d'éléments
                        }
                    }}
                    */
                />
                {this._displayLoading()}
            </View>
        )
    }
}

export default Search

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        // marginTop: 20
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
