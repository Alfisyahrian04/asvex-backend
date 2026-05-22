const authStore = {

  getUser() {

    return JSON.parse(
      localStorage.getItem(
        'user'
      )
    );

  },

  getToken() {

    return localStorage.getItem(
      'token'
    );

  },

  isLoggedIn() {

    return !!localStorage.getItem(
      'token'
    );

  },

  logout() {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    location.href =
      '/login.html';

  }

};

export default authStore;
