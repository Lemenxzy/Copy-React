import {Reconcile} from './copyRender';

class CopyComponent {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
    }

    setState(partialState) {
        this.state = Object.assign({}, this.state, partialState);
        updateInstance(this.__internalInstance);
    }
}



function updateInstance(internalInstance) {
    const parentDom = internalInstance.dom.parentNode;
    const element = internalInstance.element;
    Reconcile(parentDom, internalInstance, element);
}

export default CopyComponent;