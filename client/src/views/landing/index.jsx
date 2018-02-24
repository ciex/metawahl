// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Grid, List, Segment } from 'semantic-ui-react';


import { RouteProps } from '../../types/';
import { TERRITORY_NAMES } from '../../config/';
import Map from '../../components/map/';

class LandingView extends React.Component<RouteProps> {
  render() {
    const territorries = Object.keys(TERRITORY_NAMES)
      .filter(k => ['deutschland', 'europa'].indexOf(k) === -1).map(k =>
      <List.Item key={k}>
        <Link to={'/wahlen/' + k + '/'}>{TERRITORY_NAMES[k]}</Link>
      </List.Item>);

    return <Container>
      <Container textAlign='center' style={{margin: "4em auto 7em"}}>
        <h1 className="ui header" style={{fontSize: "4rem"}}>
          Metawahl
          <div className="ui sub header" style={{textTransform: "none", color: "rgba(0,0,0,0.8)", fontSize: "1.5rem"}}>
            Was wir gewählt haben,<br /> als wir Parteien unsere Stimme
            gaben
          </div>
          <div className="ui sub header" style={{fontSize: "0.9rem", fontStyle: "italic", marginTop: ".5rem", textTransform: "none"}}>
            Von <a href="https://vincentahrend.com/" style={{color: "rgba(0,0,0,.6)", borderBottom: "1px solid rgba(0,0,0,.4)"}}>Vincent Ahrend</a>
          </div>
        </h1>
      </Container>

      <Container text>
        <p>
          Metawahl verbindet Wahlergebnisse der letzten 16 Jahre mit über 21.000 Parteipositionen aus dem
          Wahl-o-Maten. Dabei wird sichtbar: Hat eine Mehrheit der Wähler für eine Idee gestimmt – oder dagegen?
        </p>
        <p>
          Hierdurch werden Entwicklungen deutlich, wie die bei der Frage nach der Aufnahme von Asylsuchenden zwischen
          den Bundestagswahlen 2013 und 2017. Vor der Flüchtlingskrise war das Ergebnis neutral, jetzt gibt es eine knappe
          Mehrheit <em>gegen</em> eine Obergrenze:
        </p>
      </Container>

      <Grid stackable columns='2' style={{margin: "3em 1em"}}>
        <Grid.Column>
          <Segment as='h2' size='huge' inverted style={{backgroundColor: "rgb(169, 124, 144)", fontSize: "1.7rem"}}>
            <p style={{fontVariant: "all-small-caps", marginBottom: "0px", fontSize: "0.9em", lineGeight: "1em"}}><a href="/wahlen/deutschland/29" style={{color: "rgba(255, 255, 255, 0.9)"}}>Bundestagswahl 2013</a></p>
            Deutschland soll mehr Flüchtlinge aufnehmen
            <div style={{fontSize: "0.7em", fontWeight: "initial", lineHeight: "1.3em", marginTop: "0.3rem"}}>Keine Mehrheit dafür oder dagegen</div>
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment as='h2' size='huge' inverted style={{backgroundColor: "rgb(234, 108, 110)", fontSize: "1.7rem"}}>
            <p style={{fontVariant: "all-small-caps", marginBottom: "0px", fontSize: "0.9em", lineGeight: "1em"}}><a href="/wahlen/deutschland/42" style={{color: "rgba(255, 255, 255, 0.9)"}}>Bundestagswahl 2017</a></p>
            Für die Aufnahme von neuen Asylsuchenden soll eine jährliche Obergrenze gelten.
            <div style={{fontSize: "0.7em", fontWeight: "initial", lineHeight: "1.3em", marginTop: "0.3rem"}}>53 von 100 Wählern gaben ihre Stimme Parteien, die gegen eine Obergrenze sind.</div>
          </Segment>
        </Grid.Column>
      </Grid>

      <Container text style={{margin: "5em auto 7em"}}>
        <Header size='medium' style={{marginBottom: "1.5em"}}>
          Schau dir jetzt an
        </Header>

        <p>
          <Link to="/wahlen/deutschland/42/" style={{borderBottom: "1px solid rgba(0,0,0,0.4)"}}>
            Alle Fragen aus der <strong>Bundestagswahl 2017</strong>
          </Link>
        </p>

        <p>
          <Link to="/themen/abitur-nach-der-12-jahrgangsstufe/" style={{borderBottom: "1px solid rgba(0,0,0,0.4)"}}>
            10 Thesen zu <strong>#Abitur nach der 12. Jahrgangsstufe</strong>
          </Link>
        </p>

        <p>
          <Link to='/themen/beitrittsverhandlungen-der-turkei-mit-der-europaischen-union/' style={{borderBottom: "1px solid rgba(0,0,0,0.4)"}}>
            5 Thesen zu <strong>#Beitrittsverhandlungen der Türkei mit der Europäischen Union</strong>
          </Link>
        </p>

        <p style={{marginTop: "2em"}}>
          <Link style={{borderBottom: "1px solid rgba(0,0,0,0.4)"}} to='/themen/'>Stöbere durch fast 600 weitere Themen</Link>, oder lies mehr darüber wie Metawahl funktioniert:
        </p>
      </Container>

      <Grid stackable columns='3'>
        <Grid.Row>
          <Grid.Column>
          <h1>Wie Metawahl funktioniert</h1>
          </Grid.Column>
        </Grid.Row>

        <Grid.Column>
          <Header size='medium' >Parteien wollen unterschiedliche Politik machen</Header>

          <p>
            Bei Wahlen geben wir Parteien unsere Stimme, damit diese in unserem
            Namen Entscheidungen treffen. Jede Partei vertritt dabei
            unterschiedliche Positionen zu ausstehenden Entscheidungen.
          </p>

          <p>
            Vieles sehen die Parteien auch gleich – aber in welchen Punkten unterscheiden sie sich eigentlich voneinander?
            Der Wahl-o-Mat der Bundeszentrale für politische Bildung ist enorm
            erfolgreich darin, uns zu zeigen, welche Fragen wir ihnen stellen
            können um sie klar voneinander zu trennen.
          </p>
        </Grid.Column>

        <Grid.Column>
          <Header size='medium' >Aber welche Politik hat die Wahl gewonnen?</Header>

          <p>
            Nach der Wahl wissen wir, welche Parteien die meisten Stimmen
            bekommen haben. Wenn Parteien und Positionen sich einfach in links
            und rechts teilen ließen, wäre damit auch klar,
            welche Positionen gewonnen haben.
          </p>

          <p>
            Aber was ist, wenn Parteien sich in vielen verschiedenen Richtungen
            gegenüberstehen? Wenn eine klassisch konservative Partei auch linke Postionen
            vertritt, oder eine klassisch linke Partei auch für konservative
            Interessen einsteht? Welche Politik hat jetzt die Mehrheit
            der Wählerstimmen bekommen? Genau das zeigt Metawahl für viele
            Wahlen in Deutschland, durch eine Verbindung der Fragen und Antworten
            aus dem Wahl-o-Mat mit den jeweiligen Wahlergebnissen.
          </p>
        </Grid.Column>
        <Grid.Column>
          <Header size='medium'>Oft unter einem Kompromiss</Header>
          <p>
            Die Position mit einer Mehrheit ist dabei nicht immer die, die von den meisten
            Wählern gewünscht wird. In einem repräsentativen Wahlsystem werden
            auch ungewünschte Positionen mit eingekauft, weil es nur eine begrenzte
            Anzahl an Parteien auf dem Wahlzettel gibt.
          </p>

          <p><strong>
            Auf Metawahl findest du heraus, welche Positionen unter diesem Kompromiss
            eine Mehrheit der Wählerstimmen bekommen haben.
          </strong></p>

          <p>
            In den Thesen spiegelt sich auch, wie sich die Position der Wähler – oder
            einer Partei – über die Zeit entwickelt hat, und wie unterschiedlich
            sie bei Wahlen in Europa, den Bundestags- und verschiedenen Landtagswahlen
            sein kann.
          </p>
        </Grid.Column>
      </Grid>

      {/* <Grid stackable columns='2' style={{margin: "3em 1em"}}>
        <Grid.Column streteched>
          <Segment as='h2' size='huge' inverted style={{backgroundColor: "rgb(61, 133, 179)", fontSize: "1.7rem", height: "100%"}}>
            <p style={{fontVariant: "all-small-caps", marginBottom: "0px", fontSize: "0.9em", lineGeight: "1em"}}><a href="/wahlen/deutschland/42" style={{color: "rgba(255, 255, 255, 0.8)"}}>Bundestagswahl 2017</a></p>
            Die Videoüberwachung im öffentlichen Raum soll ausgeweitet werden.
            <div style={{fontSize: "0.7em", fontWeight: "initial", lineHeight: "1.3em", marginTop: "0.3rem"}}>68 von 100 Wählern haben ihre Stimme befürwortenden Parteien gegeben</div>
          </Segment>
        </Grid.Column>

        <Grid.Column streteched>
          <Segment as='h2' size='huge' inverted style={{backgroundColor: "rgb(169, 124, 144)", fontSize: "1.7rem", height: "100%"}}>
            <p style={{fontVariant: "all-small-caps", marginBottom: "0px", fontSize: "0.9em", lineGeight: "1em"}}><a href="/wahlen/deutschland/42" style={{color: "rgba(255, 255, 255, 0.8)"}}>Landtagswahl Nordrhein-Westfalen 2017</a></p>
            Die Videoüberwachung auf Straßen und Plätzen soll ausgeweitet werden.
            <div style={{fontSize: "0.7em", fontWeight: "initial", lineHeight: "1.3em", marginTop: "0.3rem"}}>Keine Mehrheit dafür oder dagegen</div>
          </Segment>
        </Grid.Column>
      </Grid> */}

      <Header size='large' style={{margin: "4rem auto 1em"}}>
        <Link to='/wahlen' style={{borderBottom: "1px solid rgba(0,0,0,0.4)"}}>
          Alle Wahlen
        </Link>
      </Header>

      <Grid stackable columns='4'>
        <Grid.Column>
          <Link to={'/wahlen/deutschland/'}>
            <h3>Deutschland</h3>
            <Map territory='deutschland' style={{maxHeight: "12em"}}/>
          </Link>
        </Grid.Column>

        <Grid.Column>
          <Link to={'/wahlen/europa/'}>
            <h3>Europa</h3>
            <Map territory='europa' style={{maxHeight: "12em"}}/>
          </Link>
        </Grid.Column>

        <Grid.Column>
          <h3>Landtagswahlen</h3>
          <List>
            {territorries.slice(0, parseInt(territorries.length / 2, 10))}
          </List>
        </Grid.Column>

        <Grid.Column>
          <h3>&nbsp;</h3>
          <List>
            {territorries.slice(parseInt(territorries.length / 2, 10))}
          </List>
        </Grid.Column>
      </Grid>
  </Container>
  }
}

export default LandingView;