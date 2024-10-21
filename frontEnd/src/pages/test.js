import React, { Component } from 'react';

class MyComponent extends Component {
  constructor(props) {
    super(props);

    // State can be initialized in the constructor
    this.state = {
        count: 0,
      message: 'Hello, Class Component!',
    };
  }
  
  componentDidMount() {
    // Lifecycle method: runs after the component is inserted into the DOM
    console.log('Component did mount', this.state.count++);
  }

  componentDidUpdate(prevProps, prevState) {
    // Lifecycle method: runs after the component updates
    console.log('Component did update', prevProps, prevState);
  }

  componentWillUnmount() {
    // Lifecycle method: runs just before the component is removed from the DOM
    console.log('Component will unmount');
  }

  handleClick = () => {
    // Class property arrow function for event handling
    this.setState({ message: 'Button Clicked!' });
  };

  render() {
    return (
      <div>
        <p>{this.state.message}</p>
        <button onClick={this.handleClick}>Click me</button>
      </div>
    );
  }
}

export default MyComponent;
