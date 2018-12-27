
# copy-react

学习 react 并且造一个简易 react 为 copyReact， 编译 .copy 文件


Study react and copy it

## why

学习 react 的原理。

want to learn principle for react...

## install

```npm
npm i copy-react --save
```

## use

main.copy

```jsx
import Copy, {CopyComponent} from 'copy-react'

class Demo extends CopyComponent {
    constructor(props) {
        super(props);
        this.state = {
            num: 1
        };
    }

    handle = () => {
        this.setState({
            num: this.state.num + 1
        })
    };

    render() {
        return (
            <div id='container'>
                <input type='text' value='foo' />
                <a href="javascript:void(0)" onClick={this.handle}>点我加一</a>
                <span>数字😁： {this.state.num}</span>
            </div>
        )
    }
}

export default Demo;

```

index.copy

```jsx
import Copy, { CopyRender } from 'copy-react';
import Demo from './index.copy'

CopyRender(<Demo />, document.getElementById('root'));

```

## example

link: [https://github.com/Lemenxzy/Copy-React](https://github.com/Lemenxzy/Copy-React)