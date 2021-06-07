let imageList = [...document.querySelectorAll('img')]
let length = imageList.length;

const imgLazyLoad = (function () {
    let count = 0
    return function () {
        let deleteIndexList = [];
        imageList.forEach((img,index)=>{
            // getBoundingClientRect 返回元素的大小及其相对于视口的位置，相对于窗口右上角计算
            let rect = img.getBoundingClientRect();
            // window.innerHeight 浏览器窗口的视口的高度
            if (rect.top < window.innerHeight){
                img.src = img.dataset.src
                deleteIndexList.push(index)
                count++;
                if (count === length){
                    document.removeEventListener('scroll',imgLazyLoad)
                }
            }
        })
        imageList = imageList.filter((img,index)=>!deleteIndexList.includes(index))
    }
})()

document.addEventListener('scroll',imgLazyLoad)
