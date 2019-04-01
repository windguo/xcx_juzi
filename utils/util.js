function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function transLocalTime(t) {
  return new Date(t * 1000);
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkIsLogin() {
	if (!wx.getStorageSync('storageLoginedUsernames')) {
		wx.redirectTo({
			url: '/pages/login/login'
		});
	}
}

function extract_chinese(txt) {
	var reg = /[\u4e00-\u9fa5]/g;
	var names = txt.match(reg);
	let t;
	t = names.join("");
	return t;
};

module.exports = {
	checkIsLogin: checkIsLogin,
	extract_chinese: extract_chinese,
  formatTime: formatTime,
  transLocalTime: transLocalTime
}
