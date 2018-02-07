// @flow

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import './App.css';
import {
  Checkbox,
  Button,
  Header,
  Icon,
  Item,
  Loader,
  Menu,
  Segment
} from 'semantic-ui-react';

import { API_ROOT, setTitle } from './Config';
import { loadFromCache, saveToCache } from './App';
import type { TagType, RouteProps, ErrorState } from './Types';

type sorting = "count" | "name";

type State = {
  tags: Array<TagType>,
  tagsState: ErrorState,
  showSingleTags: boolean,
  sortBy: sorting
};

export default class TagList extends Component<RouteProps, State> {
  constructor(props: RouteProps) {
    super(props);
    autoBind(this);
    const savedTags = loadFromCache('taglist');
    this.state = {
      showSingleTags: false,
      tags: savedTags != null ? JSON.parse(savedTags) : [],
      tagsState: savedTags != null ? "success" : "loading",
      sortBy: "count"
    }
  }

  componentDidMount() {
    this.loadTags();
    setTitle('Tags');
  }

  loadTags(): void {
    fetch(`${API_ROOT}/tags/`)
      .then(response => response.json())
      .then(response => {
        this.setState({
          tags: response.data,
          tagsState: "success"
        });
        saveToCache('taglist', JSON.stringify(response.data));
      })
      .catch((error: Error) => {
        // https://github.com/facebookincubator/create-react-app/issues/3482
        if (process.env.NODE_ENV !== 'test') {
          console.log(error.message)
          this.setState({
            tags: [],
            tagsState: "error"
          });
        }
      }
    );
  }

  sortBy(method: sorting) {
    this.setState({sortBy: method});
  }

  toggleSingleTags(e: SyntheticInputEvent<HTMLInputElement>, { checked }: { checked: boolean }) {
    this.setState({showSingleTags: checked});
  }

  render() {
    // TODO: Protect against infinite recursion
    const sortByName = (tagA, tagB) => {
      return tagA.slug === tagB.slug
        ? sortByThesisCount(tagA, tagB)
        : tagA.slug < tagB.slug ? -1 : 1;
    };

    const sortByThesisCount = (tagA, tagB) => {
      return tagA.thesis_count === tagB.thesis_count
        ? sortByName(tagA, tagB)
        : tagA.thesis_count > tagB.thesis_count ? -1 : 1;
    };

    const tagElems = this.state.tags
      .filter(t => this.state.showSingleTags === true ? true : t.thesis_count > 1)
      .sort(this.state.sortBy === "name" ? sortByName : sortByThesisCount)
      .map((tag, i) => <Item key={"Tag-" + i} href={'/tags/' + tag.slug}>
        <Item.Content>
          <Item.Header>
            {tag.title}
            <span style={{color: "rgba(0,0,0,.4)"}}>
              &nbsp; {tag.thesis_count}
            </span>
          </Item.Header>
          { tag.description != null && tag.description.length > 0 &&
            <Item.Description>
              {tag.description}
            </Item.Description>
          }
        </Item.Content>
      </Item>);

    // TODO: Error message when loadin failed

    return <div className="tagList">
        <Button icon as='a' color='blue' basic floated="right"
          href={API_ROOT + '/tags.json?include_theses_ids=1'}
          labelPosition='left'>
          <Icon name='download' />
          tags.json
        </Button>

        <Header as='h1'>
          <Icon name="hashtag" />
          <Header.Content>
            Themen
          </Header.Content>
        </Header>

        <p>Über die Zuordnung zu {this.state.tags.length} verschiedenen Themen
        kannst du hier die Wandlung politischer Positionen über die Grenzen einer
        einzelnen Wahl hinweg nachvollziehen.</p>

        <p>Durch Klick auf einen Eintrag der Liste unten gelangst du zu einer
        zeitlich sortierten Auflistung der dazugehörigen Thesen aus allen Wahl-o-Maten.</p>

        <p> Fast jedes dieser Themen ist dabei einem Artikel auf Wikipedia
        zugeordnet. So kannst du gleich nachlesen, was genau der Unterschied
        zwischen <a href="/tags/fluchtling">Flüchtlingen</a> und <a href="/tags/asylbewerber">Asylbewerbern</a> ist,
        was mit <a href="/tags/informationelle-selbstbestimmung">informationeller Selbstbestimmung</a> gemeint
        ist und was der <a href="/tags/verfassungsschutz">Verfassungsschutz</a> eigentlich
        für Aufgaben hat.</p>

        <Menu attached="top" tabular>
          <Menu.Item
            name="alphabetisch"
            active={this.state.sortBy === "name"}
            onClick={() => this.sortBy("name")} />
          <Menu.Item
            name="nach Anzahl Thesen"
            active={this.state.sortBy === "count"}
            onClick={() => this.sortBy("count")} />
        </Menu>

        <Segment attached="bottom">
          <Loader active={this.state.tagsState === "loading"}
            inline='centered' />
          { tagElems.length > 0 &&
            <div>
              <Checkbox
                label="Zeige Tags mit nur einer These"
                onChange={this.toggleSingleTags}
                toggle
              />
              <Item.Group link className="divided">
                {tagElems}
              </Item.Group>
            </div>
          }
        </Segment>
      </div>;
  }
};
