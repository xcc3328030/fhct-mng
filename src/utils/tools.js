const tools = {
  UrlSearch () {
    let name,value;
    let str=location.href; //取得整个地址栏
    let num=str.indexOf("?")
    str=str.substr(num+1); //取得所有参数   stringlet.substr(start [, length ]

    let arr=str.split("&"); //各个参数放到数组里
    console.log(arr)
    for(let i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
             name=arr[i].substring(0,num);
             value=arr[i].substr(num+1);
             this[name]=value;
        }
    }
    return value
  },
  setSessionStorage (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  getSessionStorage (key) {
    return JSON.parse(sessionStorage.getItem(key));
  },
  removeSessionStorage (key) {
    sessionStorage.removeItem(key);
  }
}
export default tools