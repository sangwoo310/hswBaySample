import React, { Component } from 'react'

export const withSplitting = getComponent => {
  return class withSplitting extends Component {
    state = {
      Splitted: null,
    }

    componentDidMount = () => {
      getComponent().then(({ default: Splitted }) => {
        this.setState({
          Splitted,
        })
      })
    }

    render() {
      const { Splitted } = this.state
      if (!Splitted) {
        return null
      }

      return <Splitted {...this.props} />
    }
  }
}
