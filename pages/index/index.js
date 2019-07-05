const app = getApp();
//引入 bmap-wx.min.js
var bmap = require('../../libs/bmap-wx.js');
// new一个百度地图对象
var BMap = new bmap.BMapWX({
    ak: "GATVUsrGsAmSApsq8zaDvXoKaSNvebYc"
});
Page({
    data: {
        name: '',
        avatar: '',
        iv: '',
        encryptedData: '',
        markers: [],
        latitude: '22.5598575871',
        longitude: '114.1675769199'
    },

    onLoad: function() {
        let that = this
            //首先获取经纬度
        that.getWxLocation();
    },


    //首先获取经纬度
    getWxLocation: function() {
        var that = this;
        //调用wx.getLocation()获取经纬度
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                console.log(res)
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy
                that.setData({
                        latitude: latitude,
                        longitude: longitude
                    })
                    //获取成功后调用百度地图检索周边接口
                that.search();
            }
        })
    },
    //调用检索周边接口
    search: function() {
        var that = this;
        BMap.search({
            //小程序marker图标 必填
            iconPath: '../../img/red-location.png',
            //关键字
            query: "美食",
            success: function(res) {
                console.log(res);
                that.setData({
                    markers: res.wxMarkerData
                })
            },
        })
    },
    //点击marker
    makertap: function(e) {
        var id = e.markerId;
        console.log(this.data.markers[id])
    },

    onShow: function() {

        var that = this;

        //调用定位方法

        that.getUserLocation();

    },

    //定位方法

    getUserLocation: function() {

        var that = this;

        wx.getSetting({

            success: (res) => {

                // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面

                // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权

                // res.authSetting['scope.userLocation'] == true    表示 地理位置授权

                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {

                    //未授权

                    wx.showModal({

                        title: '请求授权当前位置',

                        content: '需要获取您的地理位置，请确认授权',

                        success: function(res) {

                            if (res.cancel) {

                                //取消授权

                                wx.showToast({

                                    title: '拒绝授权',

                                    icon: 'none',

                                    duration: 1000

                                })

                            } else if (res.confirm) {

                                //确定授权，通过wx.openSetting发起授权请求

                                wx.openSetting({

                                    success: function(res) {

                                        if (res.authSetting["scope.userLocation"] == true) {

                                            wx.showToast({

                                                title: '授权成功',

                                                icon: 'success',

                                                duration: 1000

                                            })

                                            //再次授权，调用wx.getLocation的API

                                            that.getWxLocation();

                                        } else {

                                            wx.showToast({

                                                title: '授权失败',

                                                icon: 'none',

                                                duration: 1000

                                            })

                                        }

                                    }

                                })

                            }

                        }

                    })

                } else if (res.authSetting['scope.userLocation'] == undefined) {

                    //用户首次进入页面,调用wx.getLocation的API

                    that.getWxLocation();
                    console.log('123')

                } else {

                    console.log('授权成功')

                    //调用wx.getLocation的API

                    that.getWxLocation();

                }

            }

        })



    },

    getUserInfo: function() {
        var that = this;
        wx.getSetting({
            // res.authSetting['scope.userInfo'] == undefined    表示 初始化进入该页面

            // res.authSetting['scope.userInfo'] == false    表示 非初始化进入该页面,且未授权

            // res.authSetting['scope.userInfo'] == true    表示 用户信息授权

            success: function(res) {
                if (res.authSetting['scope.userInfo'] != undefined && res.authSetting['scope.userInfo'] != true) {

                    //未授权

                    wx.showModal({

                        title: '请求授权当用户信息',

                        content: '需要获取您的信息，请确认授权',

                        success: function(res) {

                            if (res.cancel) {

                                //取消授权

                                wx.showToast({

                                    title: '拒绝授权',

                                    icon: 'none',

                                    duration: 1000

                                })

                            } else if (res.confirm) {

                                //确定授权，通过发起授权请求
                                wx.openSetting({

                                    success: function(res) {

                                        if (res.authSetting["scope.userInfo"] == true) {

                                            wx.showToast({

                                                title: '授权成功1',

                                                icon: 'success',

                                                duration: 1000

                                            })

                                        }

                                    }

                                })

                                //再次授权，调用wx.getUserInfo的API
                                app.wxlogin();

                                if (app.globalData.username == '') {

                                    that.get();

                                } else {

                                    wx.showToast({

                                        title: '登录成功1',

                                        icon: 'success',

                                        duration: 1000

                                    })

                                }


                            } else {

                                wx.showToast({

                                    title: '授权失败',

                                    icon: 'none',

                                    duration: 1000

                                })

                                return false

                            }

                        }

                    })

                } else if (res.authSetting['scope.userInfo'] == undefined) {

                    //用户首次进入页面,调用wx.getInfo的API
                    app.wxlogin();

                    if (app.globalData.username = '') {

                        that.get();

                    } else {

                        wx.showToast({

                            title: '登录成功2',

                            icon: 'success',

                            duration: 1000

                        })

                    }


                } else {

                    if (app.globalData.api_token = '') {

                        app.wxlogin();

                        if (app.globalData.username = '') {

                            //调用wx.getInfo的API
                            that.get();

                        } else {

                            wx.showToast({

                                title: '登录成功3',

                                icon: 'success',

                                duration: 1000

                            })

                        }

                    } else {

                        wx.request({
                            url: 'http://api.biteanbox.com/v1/user/info',
                            data: {},
                            method: "GET",
                            header: {
                                'Authorization': `Bearer ${app.globalData.api_token}`,
                                'content-type': 'application/json' // 默认值                            
                            },
                            success: (res) => {
                                console.log(res)
                                if (res.statusCode == '200') {

                                    wx.showToast({

                                        title: '登录成功4',

                                        icon: 'success',

                                        duration: 1000

                                    })

                                } else {
                                    console.log('errMsg:' + `${res.message}` + '------' + `${res.data.code}`);
                                    return false

                                }
                            }

                        })

                    }

                }

            }
        })


    },



    getPhoneNumber(e) {
        var that = this;
        var iv = e.detail.iv;
        var encryptedData = e.detail.encryptedData;
        that.setData({
            iv: iv,
            encryptedData: encryptedData
        })
    },

    get: function() {

        var that = this
        wx.getUserInfo({
            success: function(res) {
                console.log(res)
                var userInfo = res.userInfo;
                var iv = that.data.iv;
                var ency = that.data.encryptedData
                var name = userInfo.nickName;
                var avatar = userInfo.avatarUrl;

                wx.request({

                    url: 'http://api.biteanbox.com/v1/user/wxm_register',
                    data: {
                        encrypted_data: ency,
                        iv: iv,
                        name: name,
                        avatar: avatar,
                    },
                    method: "POST",
                    header: {
                        'Authorization': `Bearer ${app.globalData.api_token}`,
                        'content-type': 'application/json' // 默认值
                    },
                    success: function(res) {
                        console.log(res)
                        if (res.statuCode = 200) {
                            wx.showToast({

                                title: '登录成功',

                                icon: 'none',

                                duration: 1000

                            })
                        } else {
                            console.log('errMsg:' + `${res.message}` + `${res.data.code}`);
                        }
                    }
                })
            },
            fail: function(res) {
                wx.showToast({

                    title: '授权失败',

                    icon: 'none',

                    duration: 1000

                })
            }
        })

    },

    scanCode: function() {

        var that = this;
        app.wxlogin();
        wx.scanCode({ //这是微信提供的调取扫一扫功能的方法，api依旧简单的让人绝望
            success: (res) => { //扫码成功
                var path = res.result; //把链接取出存到变量
                var reg = new RegExp('https://d.biteanbox.com/', "g"); //然后创建一个正则表达式，截取scene=后面的数据部分
                var scene = path.replace(reg, ""); //保留有用的部分重新存储到这个变量里
                var deviceId = scene.split("_")[0];
                var boxId = scene.split("_")[1];


                // var scene = decodeURIComponent(scene); //这是解码方式，把得到的链接数据进行解密
                // var pathArr = scene.split('?'); //然后通过 ？号截取问号之后的数据。
                // //截取成功以后的格式storeCode=10003060&tableNo=0001
                // var arrPara = pathArr[1].split("&"); //再通过&符进行截取数据之后格式为： //storeCode=10003060   tableNo=0001
                // var arr = [];
                // for (var i in arrPara) {
                //     // 通过 = 号在截取一次   `这是截取后的数据应该是 storeCode,10003060     tableNo,0001
                //     arr = arrPara[i].split("-");
                //     //循环定义存到缓存，用的时候调用就可以了。					
                //     wx.setStorageSync(i == 0 ? "deviceid" : "boxid", arr[1]);

                console.log(res)
                wx.request({
                    'Authorization': `Bearer ${app.globalData.api_token}`,
                    url: 'http://api.biteanbox.com/v1/charge/start',
                    data: {
                        device_id: deviceId,
                        plan_time: 3600,
                        box_id: boxId
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function(res) {
                        if (res.statuCode == 200) {
                            console.log(res)
                        } else {
                            console.log('errMsg:' + `${res.message}` + '------' + `${res.data.code}`);
                        }
                    },
                    fail: function(res) {
                        console.log(res)
                    }

                })
            },
            fail: (res) => {
                console.log(res)
                wx.showToast({
                    title: '扫码失败',
                    icon: 'loading',
                    duration: 1500
                })
            },
        })


    },

    showMyInfo: function() {

        var that = this;

        that.getUserInfo();

    },

    enterCode: function() {

        var that = this;

        that.getUserInfo();

    }

})