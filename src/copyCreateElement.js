//bable
// const element = myCreateElement(
//     "div",{ id: "container" },
//     myCreateElement("input", { value: "foo", type: "text" }),
//     myCreateElement(
//         "a",
//         { href: "/bar" },
//         "bar"
//     ),
//     myCreateElement(
//         "span",
//         { onClick: e => alert("Hi") },
//         "click me"
//     )
// );


const TEXT_ELEMENT = "TEXT ELEMENT";

function createTextElement(value) {
    return copyCreateElement(TEXT_ELEMENT, { nodeValue: value });
}

function copyCreateElement(type, config, ...arg) {
    console.log(arg);
    const props = Object.assign({}, config);
    const hasChildren = arg.length > 0;
    const rawChildren = hasChildren ? [].concat(...arg) : [];
    //排除的子列表null、undefined、false
    props.children = rawChildren.filter(c => c != null && c !== false)
        .map(c => c instanceof Object ? c : createTextElement(c));

    return {type, props}
}

export default copyCreateElement;