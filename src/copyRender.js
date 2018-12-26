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

let rootInstance = null;

function copyRender(element, container) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;//{"dom":{},"element":{"type":"h1","props":{"children":[{"type":"TEXT ELEMENT","props":{"nodeValue":"下午3:08:57","children":[]}}]}},"childInstances":[{"dom":{},"element":{"type":"TEXT ELEMENT","props":{"nodeValue":"下午3:08:57","children":[]}},"childInstances":[]}]}
}

function reconcile(parentDom, instance, element) {
    //首次是 null
    if (instance == null) {
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    } else if (element == null) {
        // Remove instance
        parentDom.removeChild(instance.dom);
        return null;
    } else if (instance.element.type === element.type) {
        // Update instance
        updateDomProperties(instance.dom, instance.element.props, element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    }else {
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    }
}

//子元素的diff
function reconcileChildren(instance, element) {
    const dom = instance.dom;
    const childInstances = instance.childInstances;
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length, nextChildElements.length);
    for (let i = 0; i < count; i++) {
        const childInstance = childInstances[i];
        const childElement = nextChildElements[i];
        const newChildInstance = reconcile(dom, childInstance, childElement);
        newChildInstances.push(newChildInstance);
    }
    return newChildInstances.filter(instance => instance != null);
}

function instantiate(element) {
    const { type, props } = element;

    //判断是不是 text 节点
    const isTextElement = type === "TEXT ELEMENT";
    const dom = isTextElement ? document.createTextNode("") : document.createElement(type);

    updateDomProperties(dom, [], props);

    // Instantiate and append children
    const childElements = props.children || [];
    //递归
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));

    const instance = { dom, element, childInstances };
    return instance;
}

function updateDomProperties(dom, prevProps, nextProps) {
    const isEvent = name => name.startsWith("on");
    const isAttribute = name => !isEvent(name) && name != "children";

    // Remove event listeners
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });

    // Remove attributes
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null;
    });

    // Set attributes
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name] = nextProps[name];
    });

    // Add event listeners
    Object.keys(nextProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    });
}


export default copyRender;
