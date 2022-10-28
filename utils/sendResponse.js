const sendResponse = (res, status, message, content) => {
	if (isNaN(status)) res.json({ message, content })
	else res.status(status).json({ message, content });
};

module.exports = sendResponse;
