import { axios } from '@bundled-es-modules/axios'

class HyperChessAPI {
    constructor(url, token) {
        this.api_url = url;
        this.token = token;
    }

    /*DEFINE FUNCTIONS*/
    // Users
    login(payload) {
        return this._post("login", payload);
    }

    getAllUsers() {
        return this._get("users")
    }

    getUser(user_id) {
        return this._get("users/" + user_id)
    }

    newUser(payload) {
        return this._post("users", payload)
    }

    // Decks
    getAllDecksFromUser(user_id){
        return this._get("decks/user/" + user_id)
    }

    getDeck(deck_id) {
        return this._get("decks/" + deck_id)
    }

    updateDeck(deck_id, deck) {
        return this._put("decks/" + deck_id, deck)
    }

    deleteDeck(deck_id){
        return this._delete("decks/" + deck_id)
    }

    newDeck(deck){
        return this._post("decks", deck)
    }

    /*UTILS*/
    _get(route) {
        const that = this;
        return new Promise((resolve, reject) => {
            axios({
                url: route,
                baseURL: that.api_url,
                method: "get",
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "x-access-token": that.token,
                },
            })
            .then((r) => {
                resolve(r.data);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    _put(route, payload) {
        const that = this;
        return new Promise((resolve, reject) => {
            axios({
                url: route,
                baseURL: that.api_url,
                method: "put",
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "x-access-token": that.token,
                },
                data: JSON.stringify(payload),
            })
            .then((r) => {
                resolve(r.data);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    _post(route, payload) {
        const that = this;
        return new Promise((resolve, reject) => {
            axios({
                url: route,
                baseURL: that.api_url,
                method: "post",
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "x-access-token": that.token,
                },
                data: payload,
            })
            .then((r) => {
                resolve(r.data);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    _delete(route: string) {
        const that = this;
        return new Promise((resolve, reject) => {
            axios({
                url: route,
                baseURL: that.api_url,
                method: "delete",
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "x-access-token": that.token,
                },
            })
            .then((r) => {
                resolve(r.data);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    setToken(token){
        this.token = token
    }
}

export default HyperChessAPI;
