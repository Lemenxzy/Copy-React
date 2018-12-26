/*
const element = {
    type: "div",
    props: {
        id: "container",
        children: [
            { type: "input", props: { value: "foo", type: "text" } },
            { type: "a", props: {
                    onClick: e => alert("Hi"),
                    href: "javascript:void(0)",
                    children: [
                        {
                            type: "TEXT ELEMENT",
                            props: {nodeValue: "aaaa"}
                        }
                    ]
                }
            },
            { type: "span", props: {
                    children: [
                        {
                            type: "TEXT ELEMENT",
                            props: { nodeValue: "哈哈哈哈😁" }
                        }
                    ]
                }
            }
        ]
    }
};
*/

function copyRender(element, parentDom) {
    const { type, props } = element;

    //判断是不是 text 节点
    const isTextElement = type === "TEXT ELEMENT";
    const dom = isTextElement ? document.createTextNode("") : document.createElement(type);

    //添加事件监听
    const isListener = name => name.startsWith("on");
    Object.keys(props).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[name]);
    });

    //不是事件也不是子
    const isAttribute = name => !isListener(name) && name != "children";
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name] = props[name];
    });

    const childElements = props.children || [];
    //递归,先将对象里的append到div中
    childElements.forEach(childElement => copyRender(childElement, dom));
    //递归结束还会在执行一下这一步，会将div渲染到root中
    // Append or replace dom
    if (!parentDom.lastChild) {
        parentDom.appendChild(dom);
    } else {
        parentDom.replaceChild(dom, parentDom.lastChild);
    }
}

export default copyRender;
