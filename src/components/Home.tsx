import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';

type AppState = {
    markdown: string;
}

export default class Home extends Component<{}, AppState>{
    constructor(props:any) {
        super(props)
    
        this.state = { markdown: '' }
      }

      componentWillMount() {
        // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
        fetch("/markdown/home.md")
            .then(res => res.text())
            .then(text => this.setState({ markdown: text }));
      }
      
      render(){
        const { markdown } = this.state;
        
        return (
        
        <div className="container mt-5" >
            <section>
                <ReactMarkdown source={markdown} />
            </section>
        </div >
    );
      }
}
