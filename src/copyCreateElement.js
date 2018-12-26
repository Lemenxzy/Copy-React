//bable
// const ele = Copy.copyCreateElement(
//     'div',
//     { id: 'container' },
//     Copy.copyCreateElement('input', { type: 'text', value: 'foo' }),
//     Copy.copyCreateElement(
//         'a',
//         { href: 'javascript:void(0)', onClick: e => alert("Hi") },
//         '\u70B9\u6211'
//     ),
//     Copy.copyCreateElement(
//         'span',
//         null,
//         '\u54C8\u54C8\u54C8\u54C8\uD83D\uDE01'
//     )
// );


const TEXT_ELEMENT = "TEXT ELEMENT";

function createTextElement(value) {
    return copyCreateElement(TEXT_ELEMENT, { nodeValue: value });
}

function copyCreateElement(type, config, ...arg) {
    const props = Object.assign({}, config);
    const hasChildren = arg.length > 0;
    const rawChildren = hasChildren ? [].concat(...arg) : [];
    //排除的子列表null、undefined、false
    props.children = rawChildren.filter(c => c != null && c !== false)
        .map(c => c instanceof Object ? c : createTextElement(c));

    return {type, props}
}

export default copyCreateElement;