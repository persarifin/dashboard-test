import React , {Component} from 'react'

class Counter extends Component{
    constructor(props){
        super(props)
        this.state = {
            disable: false,
            num: 0
        }

        this.increment = this.increment.bind(this)
        this.decrement = this.decrement.bind(this)
    }

    // componentDidMount(){
    //     this.setState({
    //         value: 
    //     })
    // }

    increment(){
        this.setState(prevState => ({
            num: prevState.num + 1
        }))
        
    }

    decrement(){
        this.setState(prevState => ({
            num: prevState.num - 1
        }))
        
    }

    render(){
        return(
            <div className="counter-container">
                <div onClick={this.decrement}><i className="fa fa-minus" style={{ cursor:'pointer', borderRadius: '50%', backgroundColor:'#FF6666', color:'#FFF', padding:'3px' }}></i></div>
                <div>{this.state.num + this.props.counter}</div>
                <div onClick={this.increment}><i className="fa fa-plus" style={{ cursor:'pointer', borderRadius: '50%', backgroundColor:'#2196F3', color:'#FFF', padding:'3px' }}></i></div>
            </div>
        )
    }
}

export default Counter