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


function createPublicInstance(element, internalInstance) {
    const { type, props } = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;
    console.log(111, publicInstance);
    return publicInstance;
}

function CopyRender(element, container) {
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
    } else if (instance.element.type !== element.type) {
        // Replace instance
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;

    } else if (typeof element.type === "string") {
        // Update dom instance
        updateDomProperties(instance.dom, instance.element.props, element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    } else {
        //Update composite instance
        instance.publicInstance.props = element.props;
        const childElement = instance.publicInstance.render();
        const oldChildInstance = instance.childInstance;
        console.log(childElement, '-------', oldChildInstance);
        const childInstance = reconcile(
            parentDom,
            oldChildInstance,
            childElement
        );
        instance.dom = childInstance.dom;
        instance.childInstance = childInstance;
        instance.element = element;
        return instance;
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
    const isDomElement = typeof type === "string";
    if (isDomElement) {
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
    } else {
        // Instantiate component element
        // 初始化 组件 <App />
        const instance = {};

        // createPublicInstance
        // 1. 新建 newApp = new App()
        // 2. newApp.__internalInstance = instance
        // 3. publicInstance = newApp
        const publicInstance = createPublicInstance(element, instance);
        //
        const childElement = publicInstance.render(); // 自己定义的 渲染-render-函数

        const childInstance = instantiate(childElement); // 递归 孩子拿到 { dom, element, childInstances }
        const dom = childInstance.dom;

        Object.assign(instance, { dom, element, childInstance, publicInstance }); // >> 组件元素比Didact元素 多了本身- 实例
        return instance;
    }

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


export default CopyRender;
export const Reconcile = reconcile;