module.exports = {

  apps: [

    {

      name:
        'marketplace',

      script:
        './src/server.js',

      instances:
        'max',

      exec_mode:
        'cluster'

    }

  ]

};
