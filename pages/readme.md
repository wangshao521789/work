onShow: function () {

    var _this = this;

    //调用定位方法

    _this.getUserLocation();

  },

//定位方法

getUserLocation: function () {

    var _this = this;

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

            success: function (res) {

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

                  success: function (res) {

                    if (res.authSetting["scope.userLocation"] == true) {

                      wx.showToast({

                        title: '授权成功',

                        icon: 'success',

                        duration: 1000

                      })

                      //再次授权，调用wx.getLocation的API

                      _this.geo();

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

          _this.geo();

        }

        else {

          console.log('授权成功')

          //调用wx.getLocation的API

          _this.geo();

        }

      }

    })

 

  },         

 

// 获取定位城市

  geo: function () {

    var _this = this;

    wx.getLocation({

      type: 'wgs84',

      success: function (res) {

        var latitude = res.latitude

        var longitude = res.longitude

        var speed = res.speed

        var accuracy = res.accuracy

        wx.request({

          url: 'http://apis.map.qq.com/ws/coord/v1/translate?locations=' + res.latitude + ',' + res.longitude + '&type=1&key=CRDBZ-LEER4-GJGUY-D674G-QRTBQ-UJFWA',

          data: {},

          header: { 'Content-Type': 'application/json' },

          success: function (ops) {

            console.log('定位城市：', ops.data.result.addressComponent.city)

          },

          fail: function (resq) {

            wx.showModal({

              title: '信息提示',

              content: '请求失败',

              showCancel: false,

              confirmColor: '#f37938'

            });

          },

          complete: function () {

          }

        })

      }

    })

  },

   wx.getLocation({
          type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
          success: function (res) {
            // success
            console.log(res.latitude);
            console.log(res.longitude);

            wx.openLocation({
              latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
              longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
              scale: 28, // 缩放比例
              name:"要找的地方名字（某某饭店）",
              address:"地址：要去的地点详细描述"
            })
          }
        })