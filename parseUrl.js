const url = 'https://xxx.xxx.com/public-site/my-design/255?modelId=180&isDefault'

function parseParam(url) {
    const paramStr = /.+\?(.+)$/.exec(url)[1]
    const paramArr = paramStr.split('&')
    let parseObj = {}

    paramArr.forEach(param=>{
        if (/=/.test(param)){
            let [key,value] = param.split('=')
            // 值会经过编码，获取时需要解码
            // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
            value = decodeURIComponent(value);

            if (parseObj.hasOwnProperty(key)){
                parseObj[key] = [].concat(parseObj[key],value)
            }else {
                parseObj[key] = value
            }
        }else {
            // 没有值的参数取决于处理函数如何处理
            // https://stackoverflow.com/questions/4557387/is-a-url-query-parameter-valid-if-it-has-no-value
            parseObj[param] = true;
        }
    })

    return parseObj
}

console.log(parseParam(url))