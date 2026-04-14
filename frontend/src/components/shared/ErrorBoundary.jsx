import React from 'react';
import Error500 from '../../pages/errors/Error500';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Error capturado:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <Error500 error={this.state.error?.message} />;
    }
    return this.props.children;
  }
}
