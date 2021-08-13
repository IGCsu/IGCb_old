module.exports = {

    send : function(data, msg){
        client.api.interactions(data.id, data.token).callback.post({
            data: {
                type: 4,
                data: msg
            }
        })
    },

    defSend : function(data, msg){
        client.api.interactions(data.id, data.token).callback.post({
            data: {
                type: 5,
                data: msg
            }
        })
    },

    update : function(data, msg){
        client.api.interactions(data.id, data.token).callback.post({
            data: {
                type: 7,
                data: msg
            }
        })
    },

    defUpdate : function(data, msg){
        client.api.interactions(data.id, data.token).callback.post({
            data: {
                type: 6,
                data: msg
            }
        })
    }
};