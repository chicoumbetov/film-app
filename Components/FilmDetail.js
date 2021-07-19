import React from 'react'
import {StyleSheet, View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from "react-redux";

class FilmDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            film: undefined,
            // A l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail du film
            isLoading: true
        }
    }

    componentDidMount() {
        // console.log('id:', this.props.navigation)
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            // console.log('data:', data)
            this.setState({
                film: data,
                isLoading: false
            })
        })
    }

    _toggleFavorite() {
        // Définition de notre action ici
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        this.props.dispatch(action)
    }

    componentDidUpdate() {
        console.log('componentDidUpdate', this.props.favoritesFilm)
    }

    _displayFavoriteImage = () => {
        let sourceImage = require('../Images/ic_favorite_border.png')
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            // Film dans nos favoris
            sourceImage = require('../Images/ic_favorite.png')
        }

        return (
            <Image
                source={sourceImage}
                style={styles.favorite_image}
            />
        )
    }

    _displayFilm() {
        const film = this.state.film

        if (film != undefined) {
            console.log('film:', film)
            console.log('state globale: ', this.props)
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.image}
                        source={{uri: getImageFromApi(film.backdrop_path) }}
                    />
                    <Text style={styles.title_text}>{film.title}</Text>
                    <TouchableOpacity style={styles.favorite_container} onPress={() => this._toggleFavorite()} >
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.description_text}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note : {film.vote_average} / 10</Text>
                    <Text style={styles.default_text}>Nombre de votes : {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.default_text}>
                        Genre(s) : {film.genres.map((genre) => genre.name).join(' / ')}
                    </Text>
                    <Text style={styles.default_text}>
                        Companie(s) : {film.production_companies.map((company) => company.name)}
                    </Text>
                </ScrollView>
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

    render() {
        return (
            <View style={styles.main_container}>
                {this._displayFilm()}
                {this._displayLoading()}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(FilmDetail)

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    scrollview_container: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 169,
        margin: 5
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    favorite_container: {
        alignItems: "center"
    },
    favorite_image: {
        width: 40,
        height: 40
    }
})
