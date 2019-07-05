App({


    wxlogin: function() {
        var that = this;
        wx.login({

            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: 'https://api.biteanbox.com/v1/user/wxm_login',
                    data: {
                        code: res.code
                    },
                    method: "POST",
                    header: {
                        'content-type': 'application/json' // 默认值                            
                    },
                    success: (res) => {

                        if (res.statuCode = 200) {
                            console.log(res)
                            wx.setStorage({
                                key: 'api_token',
                                data: res.data.api_token
                            });

                            that.globalData.username = res.data.name;
                            that.globalData.api_token = res.data.api_token;
                            console.log(that.globalData.api_token);
                            console.log(that.globalData.username);
                        } else {
                            console.log('errMsg:' + `${res.message}` + `${res.data.code}`);
                        }
                    }
                })
            }
        })
    },
    globalData: {
        username: '',
        api_token: ''
    }
})