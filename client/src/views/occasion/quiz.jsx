// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import autoBind from 'react-autobind';
import {
  Button, Breadcrumb, Container, Header, Loader, Message, Progress, Segment, Icon
} from 'semantic-ui-react';
import Moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../../index.css';
import Thesis from '../../components/thesis/';
import Errorhandler from '../../utils/errorHandler';
import { API_ROOT, SITE_ROOT, TERRITORY_NAMES } from '../../config/';
import { ErrorType, RouteProps, ThesisType, OccasionType } from '../../types/';
import { WikidataLabel, WikipediaLabel } from '../../components/label/DataLabel.jsx'
import SEO from '../../components/seo/';

import './styles.css';

type State = {
  isLoading: boolean,
  occasion: ?OccasionType,
  theses: Array<ThesisType>,
  quizSelection: Array<ThesisType>,
  quizAnswers: ?Array<number>,
  linkCopied: boolean,
  error?: ?string
};

export default class Quiz extends React.Component<RouteProps, State> {
  territory: string;
  occasionNum: number;
  handleError: ErrorType => any;

  constructor(props: RouteProps) {
    super(props);
    autoBind(this);
    this.occasionNum = parseInt(this.props.match.params.occasionNum, 10);
    this.territory = this.props.match.params.territory;
    this.state =  {
      isLoading: true,
      occasion: this.getCachedOccasion(),
      theses: [],
      quizSelection: [],
      quizAnswers: [],
      linkCopied: false
    }
    this.thesisRefs = {};
    this.handleError = Errorhandler.bind(this);
  }

  componentDidMount() {
    this.loadOccasion();
  }

  componentWillReceiveProps(nextProps: RouteProps) {
    if(nextProps.match.params.occasionNum !== this.occasionNum || nextProps.displayMode !== this.props.displayMode) {
      this.occasionNum = parseInt(nextProps.match.params.occasionNum, 10);
      this.territory = nextProps.match.params.territory;
      this.setState({
        isLoading: true,
        occasion: this.getCachedOccasion(),
        theses: [],
        quizAnswers: []
      });
      this.thesisRefs = {};
      this.loadOccasion();
    }
  }

  getCachedOccasion() {
    return this.props.occasions[this.territory] == null ? null :
      this.props.occasions[this.territory]
      .filter(occ => occ.id === this.occasionNum)
      .shift();
  }

  getRatio({ title, positions }, reverse=false) {
    // Determine the ratio of positive votes by summing up the vote results
    // of all parties with positive answers
    if (this.state.occasion === null) return null

    const occRes = this.state.occasion.results;

    // Combine results if multiple parties correspond to an entry (CDU + CSU => CDU/CSU)
    // otherwise just return accumulator `acc` + result of party `cur`
    const countVotes = (acc, cur) => {
      if (occRes[cur["party"]] == null) {
        let multipleLinkedResults = Object.keys(occRes)
          .filter(k => occRes[k].linked_position === cur["party"]);
        return acc + multipleLinkedResults
          .map(k => occRes[k]['pct'])
          .reduce((acc, cur) => acc + cur, 0.0);
      } else {
        return acc + occRes[cur["party"]]["pct"];
      }
    }

    const ratio = positions.filter(p => reverse ? p.value === -1 : p.value === 1).reduce(countVotes, 0.0);
    return ratio;
  }

  handleQuizAnswer(thesisNum, answer, correct) {
    const answerNode = ReactDOM.findDOMNode(this.thesisRefs[thesisNum]);
    window.scrollTo(0, answerNode.offsetTop - 35);
    this.setState({quizAnswers: this.state.quizAnswers.concat([correct])});
  }

  scrollToNextQuestion() {
    if (this.state.quizAnswers.length !== this.state.quizSelection.length) {
      const answerNode = ReactDOM.findDOMNode(this.thesisRefs[this.state.quizAnswers.length]);
      window.scrollTo(0, answerNode.offsetTop - 35);
    }
  }

  loadOccasion(cb?: OccasionType => mixed) {
    const endpoint = API_ROOT + "/occasions/" + this.occasionNum;
    fetch(endpoint)
      .then(response => response.json())
      .then(response => {
        if (!this.handleError(response)) {
          this.setState({
            occasion: response.data,
            theses: response.theses || []
          }, () => {
            this.selectQuizTheses()
          })
          if (cb != null) cb(response.data);
        }
      })
      .catch((error: Error) => {
        this.handleError(error);
        console.log("Error fetching occasion data: " + error.message)
        this.setState({
          isLoading: false,
          occasion: this.getCachedOccasion(),
          theses: []
        })
      })
  }

  selectQuizTheses() {
    const quizSelection = this.state.theses
      .sort((a, b) => a.id > b.id ? 1 : -1)
      .filter(thesis => {
        const ratioPro = this.getRatio(thesis)
        const ratioCon = this.getRatio(thesis, true)
        const rv = ratioPro > 15 && ratioCon > 15 && (ratioPro > 50 || ratioCon >= 50)
        return rv
      })
      .slice(0, 20)
    this.setState({ quizSelection, isLoading: false })
  }

  render() {
    let quizResult;
    let thesesElems;

    if (this.state.isLoading || this.state.error) {
      thesesElems = [];
    } else {
      thesesElems = this.state.quizSelection
        .slice(0, this.state.quizAnswers.length + 1)
        .map(
          (t, i) => <Thesis
            key={t.id}
            occasion={this.state.occasion}
            showHints={i === 0}
            quizMode={true}
            scrollToNextQuestion={this.scrollToNextQuestion}
            answer={(answer, correct) => this.handleQuizAnswer(i, answer, correct)}
            ref={ref => this.thesisRefs[i] = ref}
            {...t} />
        );

      quizResult = this.state.quizAnswers
        .map(a => a === true ? 1 : 0)
        .reduce((acc, cur) => acc + cur, 0) / this.state.quizAnswers.length;

    }

    return <Container fluid={false} className='occasionContainer'>
      <SEO title={'Metawahl: '
        + (this.state.occasion ? this.state.occasion.title + ' Quiz' : "Quiz")} />

      <Breadcrumb>
        <Breadcrumb.Section href="/wahlen/">Wahlen</Breadcrumb.Section>
        <Breadcrumb.Divider icon='right angle' />
        <Breadcrumb.Section href={`/wahlen/${this.territory}/`}>
          {TERRITORY_NAMES[this.territory]}
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon='right angle' />
        { this.state.occasion == null
          ? <Breadcrumb.Section>Loading...</Breadcrumb.Section>
          : <Breadcrumb.Section
              href={`/wahlen/${this.territory}/${this.occasionNum}/`}>
              {Moment(this.state.occasion.date).year()}
            </Breadcrumb.Section>
        }

        <span>
          <Breadcrumb.Divider icon='right angle' />
          <Breadcrumb.Section active href={`/quiz/${this.territory}/${this.occasionNum}/`}>
            Quiz
          </Breadcrumb.Section>
        </span>
      </Breadcrumb>

      <WikidataLabel {...this.state.occasion} style={{marginRight: "-10.5px"}} />
      <WikipediaLabel {...this.state.occasion} style={{marginRight: "-10.5px"}} />

      <Header as='h1'>
        { this.state.occasion == null
          ? " "
          : "Teste dein Wissen: " + this.state.occasion.title}
      </Header>

        <h3 style={{marginBottom: '4rem'}}>
          {
            this.state.occasion != null && this.state.occasion.preliminary
              ? "Was wird die Mehrheit in " + TERRITORY_NAMES[this.territory] + " voraussichtlich wählen?"
              : "Was hat die Mehrheit in " + TERRITORY_NAMES[this.territory] + " gewählt?"
          }

        </h3>

      { this.state.error != null &&
        <Message negative content={this.state.error} />
      }

      <Loader active={this.state.isLoading} />

      {/* Main content */}
      {this.state.isLoading === false &&
      <div className="theses">
        {thesesElems}
      </div>
      }

      {/* Quiz progress indicator */}
      { this.state.quizAnswers.length < this.state.theses.length &&
        <div>
          { this.state.quizAnswers.length !== this.state.quizSelection.length &&
            <span>Noch { this.state.quizSelection.length - this.state.quizAnswers.length } Thesen bis zum Ergebnis</span>
          }
          <Progress value={this.state.quizAnswers.length} total={this.state.quizSelection.length} success={this.state.quizAnswers.length === this.state.quizSelection.length && quizResult >= 0.5} />
        </div>
      }

      {/* Quiz Result */}
      { this.state.isLoading === false && this.state.quizAnswers.length === this.state.quizSelection.length &&
        <Segment size='large' raised className='quizResult'>
          <Header as='h1'>
            { quizResult >= 0.5 &&
              <span>Du bist ein Gewinner! {parseInt(quizResult * 100, 10)} % der Fragen richtig.</span>
            }
            { quizResult < 0.5 &&
              <span>Leider verloren. {parseInt(quizResult * 100, 10)} % der Fragen richtig.</span>
            }
          </Header>

          <p>
            <Link to={'/wahlen/' + this.territory + '/' + this.occasionNum + '/'}><Icon name='caret right' /> Öffne die Übersichtsgrafik zur {this.state.occasion.title}</Link> <br />
            <Link to={'/wahlen/'}><Icon name='caret right' /> Siehe alle Wahlen, zu denen es Quizzes gibt</Link> <br />
            <Link to='/'><Icon name='caret right' /> Finde heraus, worum es bei Metawahl geht</Link>
          </p>

          <Button.Group className='stackable'>
          <Button as='a' href={'https://www.facebook.com/sharer/sharer.php?u=' + SITE_ROOT + this.props.location.pathname}
             className='item' color='facebook' rel='nofollow' _target='blank'>Quiz auf Facebook teilen</Button>
          <Button as='a' href={'https://twitter.com/home?status=' + SITE_ROOT + this.props.location.pathname}
             className='item' color='twitter' rel='nofollow' _target='blank'>Quiz auf Twitter teilen</Button>
          <CopyToClipboard text={SITE_ROOT + this.props.location.pathname}
            onCopy={() => this.setState({linkCopied: true})}>
            <Button onClick={this.onClick}><Icon name={this.state.linkCopied ? 'check' : 'linkify'} /> Link kopieren</Button>
          </CopyToClipboard>
          </Button.Group>
        </Segment>
      }
    </Container>;
  }
}
