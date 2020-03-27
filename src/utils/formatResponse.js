module.exports = {
    FormatResponse: (success, status, data, total, message, isLast) => {
        return {
            success: success,
            status: status,
            data: data,
            total: total,
            message: message,
            isLast: isLast
        }
    }
};
