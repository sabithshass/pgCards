const reqHandling = {

    // error handler used by all endpoints.
    handleError: ({
        res,
        status,
        reason,
        code
    }) => {
        console.log("ERROR: ", reason);
        code = code ? code : 500;
        res.status(code || 500).json({
            "message": reason,
            "status": status,
            "code": code
        });
    },

    // error handler used by all endpoints.
    handleResponse: ({
        res,
        data,
        msg,
        code,
        status
    }) => {
        code = code ? code : 500;
        res.status(code || 500).json({
            "msg": msg,
            "data": data,
            "status": status,
            "code": code
        });
    },



};

module.exports = reqHandling;