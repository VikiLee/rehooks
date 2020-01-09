# `@mkt/rehooks`

> 用于增强原生的react hook或者用于shopee mkt复用

## Install

### With Yarn

```sh
yarn add @mkt/rehooks
```

### With NPM

```sh
npm i @mkt/rehooks
```

## Usage

### useState

#### 作用
和react原生的useState一样使用。不过，在改变state的值的时候，它能保存上次的值，只是在上次值的基础上进行extends。

#### 说明
```jsx
const initialState = {
    name: 'weiji.li', 
    age: 18,
    school: {
      name: 'Peking University',
      location: 'Beijing'
    }
}
const [state, setState] = useState<StateType>(initialState)

setState({
    school: {
      name: 'Qinghua University',
      location: 'Beijing'
    }
})
```
可以和react自带的useState一样使用，不过有一点不同：   
当你调用SetStateAction改变state的时候，它会保留上次的state值，比如上面的例子中修改了state中school的值，如果是自带的useState，你将会丢失name和age两个值，而该hook会保留下来。


#### 例子
```jsx
import React from 'react'
import { useState } from '@mkt/rehooks'

interface StateType {
    name: string;
    age: number;
    school: Object;
}
export default (props: any) => (

  const initState = {
    name: 'weiji.li', 
    age: 18,
    school: {
      name: 'Peking University',
      location: 'Beijing'
    }
  }
  const [state, setState] = useState<StateType>(initState)

  // newState是initState的子类型，我们的useState会把initState原来的name和age保存下来，且修改initState的school属性为newState，这是原生useState所不具备的功能
  const newState = {
    school: {
      name: 'Qinghua University',
      location: 'Beijing'
    }
  }

  return (
    <>
      <div>name: {state.name}</div>
      <div>scholl: {state.school.name} in {state.school.location}</div>
      <button onClick={_ => setState(newState)}>
        Click Me
      </button>
    </>
  )
 
);
```

### useAction

模拟vuex中的数据流，dispatcher => action => commit => mutation => change state   
#### 作用
1、按照vuex的数据流控制state，使得熟悉vuex的同学无缝过度到react，屏蔽react setState，使得state对数据流如同vuex单向流动，拥有vuex单向数据流的优点。    
2、使用useAction可以把带有副作用的代码或者是业务代码（即非视图相关代码）放入到useAction的actions中，这样可以让业务代码和视图分离，便于代码维护。  


#### 说明
```jsx
export default (props: any) => {
    const [state, dispatch, inject] = useAction({
        grow: ({ commit, state, contextProps, dispatch }: ContextType, age: number) => {
          // do stuff 
          // invoke commit to change state
          commit({
            age
          })
        },
        // ...other actions
    }, initialValue)
    
    dispatch('grow', 19)
    inject(props)   
}
  
```
传入的第一个值为定义了各种action的对象，这些对象的成员都是函数，所有的这些函数的第一个参数是Context对象，它包含了state、dispatch、contextProps以及commit四个参数： 

| parameter | description|
|--- |---|
| state | 包含当前最新的state值，由于useAction的dispatch方法用<br/>useCallback包装了，所以在action方法中拿组件的state，<br/>会是state的初始值，所以为了获取到最新的state值，该参数就是你想要的|
|commit | 如果要改变state，必须通过调用commit方法，<br/>该方法的参数就是新的state，或者state的子集|
|dispatch | 方便在一个action中触发另外一个action。<br/>如果有这样的场景：你在一个action中create了数据，然后你又想修改，<br/>这个时候应该是update数据，所以需要有id，<br/>因此你需要去拉取接口来获取刚才创建的数据的id，<br/>这个时候你dispatch这个拉取新数据的action将会非常方便|
|contextProps | 如果你把视图和业务逻辑代码分开，<br/>即上面所说的view和actions分开到两个文件，<br/>但是你想在某个action中获取到view的props，<br/>则这个参数就是你要的值了。<br/>==但是==你需要调用useAction返回的第三个值，即inject函数，<br/>并把prop作为这个函数的参数传入|



返回的第二个值为state的最新值。

返回的第三个值是inject函数，其作用就是注入组件的props给action获取。


#### 例子
```jsx
import React from 'react'
import { useAction, ContextType } from '@mkt/rehooks'
export default (props: any) => {
  const initialValue = {
    name: 'weiji',
    age: 18
  }
  const [state, dispatch, inject] = useAction({
    grow: ({ commit, contextProps }: ContextType, age: number) => {
      // invoke commit to change state
      commit({
        age
      })
    },
    // ...other actions
  }, initialValue)
  // inject props to actions
  inject(props)
  
  return (
    <>
      <p>name: {state.name}</p>
      <p>age: {state.age}</p>
      <button
        onClick={ _ => {
          dispatch('grow', age)
        }}
        data-testid={testButtonId}
      >Test Button</button>
    </>
  )
}
```

### usePrevious

#### 作用
用于获取上次state的值，这在某些场景下是非常有用的。实现原理是利用useRef的，它会保存上个state的值到的ref的current中，直到组件生命周期结束，所以等同于存储了两个state，内存会增加，所以如果你的state过大，但是你想要获取的上个值不是这整个state，可以试着把state拆小，在小的state上使用usePrevious
#### 说明
```jsx
 const [count, setCount] = useState(1)
 const previousCount = usePrevious(count)
```
调用的时候，需要把你想保存的state作为参数传入  

返回值为上个state的值，这个值取决于你调用usePrevious传入的state
#### 例子
```jsx
import React from 'react'

import { useState, usePrevious } from '@mkt/rehooks'

const Test = () => {
  
  const [count, setCount] = useState(1)
  const previousCount = usePrevious(count)

  const change = () => {
    setCount(count + 1)
  }


  return (
    <div>
      {count}: {previousCount}
      <Button onClick={() => change()}>change</Button>
    </div>

  )
}

export default Test
```

### useCookie

#### 作用
如果你想要获取页面的cookie值，并且页面依赖于这个cookie，那么这个hook就很适合，比如获取登录用户的昵称显示在页面。如果cookie中存在对应key的cookie，那么调用useCookie的时候，取到的就是cookie里面的值，而不是初始化的值，这个需要注意。

#### 说明
```jsx
const [value, setValue, removeValue] = useCookie('key', initCookie)
```
返回的数组第一个值是cookie中对应key的值，如果本身cookie中无对应的key的cookie存在，则会返回initCookie的值。  

返回数组的第二个值为SetCookieAction的函数，调用该函数，可以修改cookie中的值。该函数接收两个参数，第一参数为值，第二个参数为cookie的配置项，比如expires，domain。

返回数组的第三个值是RemoveCookieAction的函数，调用该函数，可以删除cookie。  

>注意 setCookieAction（即useCookie返回的第二个值）是可以设置cookie的expires、domains等cookie属性，但是如果你设置的expires时间很短，在其过期后cookie失效了，页面是无法监听到该cookie过期并同步到页面的
#### 例子

```jsx
import React from 'react'

import { useCookie } from '@mkt/rehooks'

const Test = () => {
  
  const [username, setUsername] = useCookie('username')
  
  const login = () => {
    setUsername('nobody')
  }

  return (<div className="user">
      { username ? `hello ${username}` : <a onClick={() => login()}>please login</a>}
    </div>
  )
}

export default Test
```

