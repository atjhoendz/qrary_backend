const FormatResponse  = (success, status, data, message, isLast) => {
    let total = Object.keys(data).length;
    return {
        success: success,
        status: status,
        data: data,
        total: total,
        message: message,
        isLast: isLast
    }
};

module.exports = FormatResponse;
