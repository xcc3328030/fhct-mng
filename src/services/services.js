import _axios from './request.js'
import { stringify } from 'qs';
import pockethospitalUrl from './api.js'

const services = {
	//获取用户信息
	fetchUser (param) {
		return _axios('get', `/v1/user/doctor`)
	},

	//--------------------------------------------------------------------------

	//获取视频订单列表
	fetchVideoList (param) {
		return _axios('post', `/v1/video_orders/es/accurate_search`, param)
	},
	//获取视频订单详情
	fetchVideoDetail (param) {
		return _axios('get', `/v1/video_orders/` + param)
	},
	//取消视频订单
	cancelVideoOrder (param) {
		return _axios('put', `/v1/video_orders/` + param + `/cancel`)
	},
	//开始视频通知后台
	startVideo (param) {
		return _axios('put', `/v1/video_orders/` + param + `/start`)
	},
	//订单修改参数
	updateVideoOrder (param1, param2) {
		return _axios('put', `/v1/video_orders/` + param1, param2)
	},
	//订单状态完成
	finishVideoOrder (param) {
		return _axios('put', `/v1/video_orders/` + param + `/finish`)
	},

	//--------------------------------------------------------------------------

	//获取远程续方列表
	fetchRemoteList (param) {
		return _axios('post', `/v1/continuation/continuation_orders/es/accurate_search`, param)
	},
	//获取远程续方详情
	fetchRemoteDetail (param) {
		return _axios('get', `/v1/continuation/waiting/orders/order_id/` + param)
	},
	//修改远程续方订单状态————拒绝开处方
	refuseRemoteRecipe (param) {
		return _axios('put', `/v1/continuation/continuation_orders/` + param + `/refused`)
	},
	//订单修改参数———绑定处方号
	updateRemoteOrder (param1, param2) {
		return _axios('post', `/v1/continuation/order/order_id/` + param1 + `/prescription_id/` + param2)
	},
	//修改远程续方订单状态————开处方
	finishRemoteRecipe (param) {
		return _axios('put', `/v1/continuation/continuation_orders/` + param + `/opened_prescription`)
	},

	//--------------------------------------------------------------------------

	//获取在线处方列表
	fetchOnlineList (param) {
		return _axios('post', `/v1/prescription/es/accurate_search`, param)
  },
  //填写快递单号
  setExpressInfo (param) {
    return _axios('post', `/v1/prescription/update_express`, param)
  },
	//获取在线处方详情
	fetchOnlineDetail (param) {
		return _axios('get', `/v1/prescription/prescription_id/` + param)
	},
	//更新在线处方信息
	updatePrescription (param) {
		return _axios('post', `/v1/prescription/update_prescription`, param)
	},
	//新增处方接口
	addPrescription (param) {
		return _axios('post', `/v1/prescription/add_prescription`, param)
	},

  // 医生列表查询
  fetchDoctorsList (param) {
    return _axios('post', '/v1/doctors/query', param)
  },

  // 医生详情信息
  fetchDoctorsDetail (param) {
    return _axios('get', `/v1/doctors/` + param)
  },

  // 医院列表信息
  fetchHospitalList (param) {
    return _axios('post', '/v1/hospitals/es/query', param)
  },

  // 科室搜索
  fetchDepartList (param) {
    return _axios('get', `/v1/departments/hospitals/` + param)
  },

  // 医生信息修改
  finishDoctors (param1, param2) {
    return _axios('put', `/v1/doctors/` + param1, param2)
  },

  // 职称下拉
  fetchDictionarysTitle () {
    return _axios('get', '/v1/dictionarys/types/title')
  },
	//--------------------------------------------------------------------------

  // 视频发送邀请
  sendInvite (param) {
    return _axios('post', `/v1/video_orders/`+ param +`/invite`)
  },

	//--------------------------------------------------------------------------

	//上传图片
	upload (param1, param2) {
		return _axios('post', `/v1/image/upload?` + this.toUrl(param1), param2)
	},
	//删除图片
	deletePicture (param) {
		return _axios('delete', `/v1/image?` + this.toUrl(param))
	},
	toUrl(obj) {
		let _temp = [];
		for(let key in obj) {
			let value = obj[key];
			if(value != undefined){
				if(this.isArray(value)){
					_temp.push(`${key}=` + value);
				}else {
					_temp.push(`${key}=${value}`);
				}
			}
		};
	  return _temp.join('&');
	},
	isArray(o){
		return Object.prototype.toString.call(o)=='[object Array]';
	}
}

export default services
