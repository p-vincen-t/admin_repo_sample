const ClientController = require('./client.controller')

module.exports = {
    Index: ClientController.Index, Auth: ClientController.Auth, About: ClientController.About, AllPages: ClientController.AllPages
}