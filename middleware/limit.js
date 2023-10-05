const { rateLimit } = require("express-rate-limit")

const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	max: 5,
	message: (req) => {
		return { rc: '68', rd:'Too many requests!.' };
	  },	
	standardHeaders: true,
	legacyHeaders: false,
})

module.exports = {
	apiLimiter
}