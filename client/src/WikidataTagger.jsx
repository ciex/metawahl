// @flow

import wikidata from '../node_modules/wikidata-sdk/dist/wikidata-sdk';
import React from 'react';
import autoBind from 'react-autobind';
import { Menu, Search } from 'semantic-ui-react';

const searchLanguage = "de";

export type WikidataType = {
  concepturi: string,
  description: string,
  id: string,
  label: string,
  match: {
    language: string,
    text: string,
    type: string
  },
  pageid: number,
  repository: string,
  title: string,
  url: string
};

type Props = {
  onSelection: (WikidataType) => mixed,
  text?: string
};

type State = {
  query: string,
  isLoading: boolean,
  results?: Array<WikidataType>
};

class WikidataTagger extends React.Component<Props, State> {
  searchTimeout: number;

  constructor(props: Props) {
    super(props);
    autoBind(this);
    this.state = {
      query: '',
      isLoading: false
    }
  }

  search(): Promise<any> {
    const query = this.state.query;
    return new Promise((resolve, reject) => {
      const url = wikidata.searchEntities({
        search: query,
        language: searchLanguage,
        limit: 5
      });

      fetch(url)
        .then(response => response.json())
        .then(results => {
          if (results.success === 1) {
            resolve(results.search);
          } else {
            reject();
          }
        })
        .catch(error => {
          console.log(`Error searching for ${query}: ${error}`);
          reject(error);
        });
    });
  }

  handleChange(e: SyntheticInputEvent<HTMLInputElement>) {
    const query = e.target.value;
    const isQueryValid = query != null && query.length >= 3;

    this.setState({
      query,
      isLoading: isQueryValid
    });

    if (isQueryValid) {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(query => {
        this.search().then(results => {
          this.setState({results, isLoading: false});
        })
      },
      350);
    }
  }

  handleSelect(e: SyntheticInputEvent<HTMLInputElement>, { result }: { result: WikidataType }) {
    this.props.onSelection(result);
    this.setState({query: '', results: [], isLoading: false});
  }

  renderResult({ title, label, description, concepturi }: WikidataType) {
    return <div key='content' className='content'>
      {title && <div className='price'>{title}</div>}
      {label && <div className='title'>{label}</div>}
      {description && <div className='description'>{description}</div>}
    </div>
  }

  render() {
    const style = {border: "none"};
    return <Menu.Menu>
      <Search
        loading={this.state.isLoading}
        onResultSelect={this.handleSelect}
        onSearchChange={this.handleChange}
        placeholder={this.props.text || "Tag hinzufügen"}
        results={this.state.results}
        resultRenderer={this.renderResult}
        style={style}
        value={this.state.query}
        className="searchNoBorder"
      />
    </Menu.Menu>
  }
}

export default WikidataTagger;
