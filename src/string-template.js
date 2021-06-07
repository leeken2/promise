function render(template,data) {
    const reg = /\{\{(\w+)\}\}/;
    if (reg.test(template)){
        const name = reg.exec(template)[1]
        template = template.replace(reg,data[name] || '');
        return render(template,data)
    }
    return template;
}

let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let person = {
    name: '布兰',
    age: 12
}

const renderText = render(template, person);

console.log(renderText)