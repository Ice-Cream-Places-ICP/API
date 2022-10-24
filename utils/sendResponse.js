const sendResponse = (status, message, content) => {
	return { status, message, content };
};

module.exports = sendResponse;
