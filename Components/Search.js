import React from 'react'
import { StyleSheet, View, TextInput, Button, FlatList } from 'react-native'
// import { films } from '../Helpers/filmsData.js'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from "../API/TMDBApi";

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = { films: []}
    }

    _loadFilms() {
        getFilmsFromApiWithSearchedText("star").then(data => this.setState({films: data.results }))
    }

    render() {
        return (
            <View style={styles.main_container}>
                <TextInput style={styles.textinput} placeholder='Titre du film'/>
                <Button title='Rechercher' onPress={() => this._loadFilms()}/>
                {/* Ici j'ai simplement repris l'exemple sur la documentation de la FlatList */}
                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <FilmItem film={item}/>}
                />
            </View>
        )
    }
}

export default Search

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        marginTop: 20
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    }
})
