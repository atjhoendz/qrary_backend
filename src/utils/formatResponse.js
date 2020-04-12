module.exports = {
    sendResponse: (res, success, status, data, message, isLast) => {
        let total = Object.keys(data).length;
        return res.status(status).json({
            success: success,
            status: status,
            data: data,
            total: total,
            message: message,
            isLast: isLast
        });
    }
};