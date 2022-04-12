import { async } from "jshint/src/prod-params";


class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=3600919019d130dae21b55a13ed586e2';

    getResource = async (url) => {
        const res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?offset=210&${this._apiKey}`);
        
        return res.data.results.map(this._transformCharacter);  // сформується масив з об'єктами, таких, як в _transformCharacter
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
        if (char.description == '') {
            char.description = "Nothing info" // якщо немає опису, то замість нього це повідомлення
        } else if (char.description.length > 200) {
            char.description = char.description.slice(0, 200) + ' ...'
        }

        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;