import { axios } from '@bundled-es-modules/axios'

class HyperChessAPI {
    constructor(url, token) {
        this.api_url = url;
        this.token = token;
    }

    /*DEFINE FUNCTIONS*/
    getPlayers(payload: any) {
        return this._get(this.api_url + "players");
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
}

export default HyperChessAPI;
