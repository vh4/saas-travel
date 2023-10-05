const AuthLogin = async (req, res, next) => {

	const token = req.session['v_session'];

	if(token === null || token === undefined){

		return res.send({
			rc:'03',
			rd: 'Token sudah expired. silahkan login kembali.'
		})

	}

	next();
}


module.exports = {
	AuthLogin
}