import config from 'config';

export const userService = {
    login,
    logout,
    register,
    checkin
};

function login(username, password) {
    return new Promise((resolve, reject) => {
        if (username == 'AWS' && password == 'aws@vn2020') {
            localStorage.setItem('login', 'AWS');
            resolve('OK');
        } else { reject('Invalid credentials. Please try again'); }
    });
}

function logout() {
    localStorage.removeItem('login');
}

function register(user) {
    return forLoop(user.images).then(imageLinks => {
        user.images = imageLinks;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };
        return fetch(`${config.apiUrl}/register`, requestOptions).then(handleResponse);
    });
}

function forLoop(images) {
    var imageLinks = [];
    return new Promise((resolve, reject) => {
        images.forEach((item, index) => {
            const linkOptions = {
                method: 'GET',
                headers: {'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*'}
            };
            fetch(`${config.apiUrl}/uploadlink`, linkOptions).then(response => {
                response.text().then(text => {
                    const data = text && JSON.parse(text);
                    if (!response.ok) {
                        if (response.status === 401) {
                            logout();
                            location.reload(true);
                        }
                        const error = (data && data.error && data.error != "NONE") || response.statusText;
                        reject(error);
                    }
    
                    var buf = new Buffer(item.replace(/^data:image\/\w+;base64,/, ""),'base64');
                    const uploadOptions = {
                        method: 'PUT',
                        headers: {'Content-Type':'image/png', 'Access-Control-Allow-Origin':'*'},
                        body: buf
                    };
                    fetch(data.link, uploadOptions).then(response2 => {
                        if (!response2.ok) {
                            if (response2.status === 401) {
                                logout();
                                location.reload(true);
                            }
                            const error = response2.statusText;
                            reject(error);
                        }
                        var imageLink = data.link.split(/[/?]+/)[2].toString();
                        imageLinks[index] = imageLink;

                        if (index === images.length-1) { resolve(); }
                    });
                });
            });
        });
    }).then(() => { return imageLinks;});
}

function checkin(guestImage) {
    var guest = {};
    return new Promise((resolve, reject) => {
        var buf = new Buffer(guestImage.image.replace(/^data:image\/\w+;base64,/, ""),'base64');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'image/png', 'Access-Control-Allow-Origin':'*' },
            body: buf
        };
        fetch(`${config.apiUrl}/checkin`, requestOptions)
            .then(handleResponse)
            .then(data => {
                guest['firstname'] = data.firstname;
                guest['lastname'] = data.lastname;
                guest['company'] = data.company;
                guest['percentage'] = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 4 }).format(data.percentage);
                //guest['percentage'] = data.percentage;
                resolve();
            }).catch(error => { reject(error); });
    }).then(() => {return guest;});
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                location.reload(true);
            }
            const error = (data && data.error) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}