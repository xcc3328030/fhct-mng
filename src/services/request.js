import axios from 'axios'
import { Notification } from 'element-ui';
//默认接口地址
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '' : ''

//响应拦截器
axios.interceptors.response.use((res) => {
	if (res.data.state != 200) {
	    Notification.error({
	      title: res.data.subCode || '',
	      message: res.data.subMsg
	    });
	}
	return res.data
}, (err) => {
	if (err.response) {
		switch (err.response.status) {
			case 401:
				window.location.href = '/login'
				break;
			case 403:
				Notification.error({
					title:'错误：403',
					message:'访问拒绝'
				})
				break;
			case 404:
				Notification.error({
					title:'错误：404',
					message:'找不到网络资源'
				})
				break;
			case 500:
				Notification.error({
					title:'错误：500',
					message:'服务器出错'
				})
				break;
		}
	}
	return Promise.reject(err)
})

export default function _axios(method, url, params) {
	method = method.toUpperCase();
	var options = {
		method: method,
		url: url,
		headers: {
			'Content-Type': 'application/json;charset-UTF-8'
		}
	}

	if (method === 'POST' || method === 'PATCH' || method === 'PUT') {

		if (params) {
			options.data = params
		}

		return axios(options)
			.then((res) => {
				return res
			}, (error) => {
				return error
			})
	}

	if (method === 'GET' || method === 'DELETE') {
		if (params) {
			options.params = params
		}

		return axios(options)
			.then((res) => {
				return res
			}, (error) => {
				return error
			})
	}
}