const { rateLimit } = require("express-rate-limit")

const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	max: 5,
	message: (req) => {
		return { rc: '68', rd:'Terlalu banyak request.' };
	  },	
	standardHeaders: true,
	legacyHeaders: false,
})

const apiLimiterKhususBooking = rateLimit({
	windowMs: 1 * 60 * 1000, 
	max: 6,
	message: (req) => {
		return { rc: '11', rd:'Terlalu banyak request booking kamu, mohon tunggu sekitar 2 menit.' };
	  },	
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = {
	apiLimiter,
	apiLimiterKhususBooking
}