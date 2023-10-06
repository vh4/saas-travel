const AuthLogin = async (req, res, next) => {

	const token = req.session['v_session'];

	if(token === null || token === undefined){

		return res.send({
			rc:'03',
			rd: 'Server telah dilakukan maintenance!. silahkan logout, kemudian login kembali.'
		})

	}

	next();
}


module.exports = {
	AuthLogin
}